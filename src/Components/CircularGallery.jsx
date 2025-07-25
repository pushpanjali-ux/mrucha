import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl"
import { useEffect, useRef } from "react"

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

class Media {
  constructor({ geometry, gl, image, index, length, screen, viewport, bend, borderRadius }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.screen = screen
    this.viewport = viewport
    this.bend = bend
    this.borderRadius = borderRadius
    this.createShader()
    this.createMesh()
this.onResize({ screen, viewport });
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) discard;

          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    })
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)

      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }

  onResize({ screen, viewport }) {
    this.screen = screen
    this.viewport = viewport

    this.plane.scale.y = (viewport.height * (900 * (screen.height / 1500))) / screen.height
    this.plane.scale.x = (viewport.width * (700 * (screen.height / 1500))) / screen.width
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]

    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index

    this.plane.setParent(this.scene)
  }
}

class App {
  constructor(container, { items, bend = 3, borderRadius = 0.05, scrollSpeed = 2, scrollEase = 0.05 }) {
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, borderRadius)
    this.update()
    this.addEvents()
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }

  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene() {
    this.scene = new Transform()
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 })
  }

  createMedias(items, bend, borderRadius) {
    this.medias = items.map((item, i) => {
      return new Media({
        geometry: this.geometry,
        gl: this.gl,
        image: item.image,
        index: i,
        length: items.length,
        screen: this.screen,
        viewport: this.viewport,
        bend,
        borderRadius,
      })
    })
    this.medias.forEach((m) => m.plane.setParent(this.scene))
  }

  update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const direction = this.scroll.current > this.scroll.last ? "right" : "left"
    this.medias.forEach((media) => media.update(this.scroll, direction))
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = requestAnimationFrame(this.update)
  }

  onWheel = (e) => {
    const delta = e.deltaY || e.wheelDelta || e.detail
    this.scroll.target += delta > 0 ? this.scrollSpeed : -this.scrollSpeed
    this.onCheckDebounce()
  }

  onCheck = () => {
    const w = this.medias[0]?.width || 0
    const idx = Math.round(Math.abs(this.scroll.target) / w)
    const item = w * idx
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }

  onTouchDown = (e) => {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
  }

  onTouchMove = (e) => {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const dist = (this.start - x) * 0.03 * this.scrollSpeed
    this.scroll.target = this.scroll.position + dist
  }

  onTouchUp = () => {
    this.isDown = false
    this.onCheck()
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })

    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }

    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }))
    }
  }

  addEvents() {
    window.addEventListener("resize", this.onResize)
    window.addEventListener("wheel", this.onWheel)
    window.addEventListener("mousedown", this.onTouchDown)
    window.addEventListener("mousemove", this.onTouchMove)
    window.addEventListener("mouseup", this.onTouchUp)
    window.addEventListener("touchstart", this.onTouchDown)
    window.addEventListener("touchmove", this.onTouchMove)
    window.addEventListener("touchend", this.onTouchUp)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener("resize", this.onResize)
    window.removeEventListener("wheel", this.onWheel)
    window.removeEventListener("mousedown", this.onTouchDown)
    window.removeEventListener("mousemove", this.onTouchMove)
    window.removeEventListener("mouseup", this.onTouchUp)
    window.removeEventListener("touchstart", this.onTouchDown)
    window.removeEventListener("touchmove", this.onTouchMove)
    window.removeEventListener("touchend", this.onTouchUp)
    this.renderer.gl.canvas.remove()
  }
}

export default function CircularGallery({ items, bend = 3, borderRadius = 0.05, scrollSpeed = 2, scrollEase = 0.05 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const app = new App(containerRef.current, { items, bend, borderRadius, scrollSpeed, scrollEase })
    return () => app.destroy()
  }, [items, bend, borderRadius, scrollSpeed, scrollEase])

  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />
}
