class Registry {
   constructor() {
      this.registry = []
   }

   includes(element) {
      return this.get(element) !== undefined
   }

   get (element) {
      return this.registry.find(r => r.domEl === element.domEl)
   }

   add (element) {
      const alreadyRegisteredElement = this.get(element)
      if (!alreadyRegisteredElement) {
         this.registry.push(element)
         return element
      } else {
         return alreadyRegisteredElement
      }
   }

   forEach (fn) {
      return this.registry.forEach(fn)
   }
}

class Element {
   constructor(domEl) {
      this.domEl = domEl
      this.visible = false
      this.handlers = {
         enter: null,
         exit: null
      }
   }

   equals(el) {
      return this.domEl === el.domEl
   }

   on(evt, handler) {
      if (!this.handlers[evt]) {
         this.handlers[evt] = handler
      }
   }

   check() {
      const box = this.domEl.getBoundingClientRect()
      if (window.innerHeight - box.top > 0) {
         if (!this.visible) {
            this.handlers.enter(this.domEl)
            this.visible = true
         }
      }
   }
}

const inView = () => {
   const interval = 100
   const registry = new Registry()

   const check = throttle(() => {
      registry.forEach(el => {
         el.check()
      })
   }, interval)

   const triggers = ['scroll', 'resize', 'load']
   triggers.forEach(trigger => {
      window.addEventListener(trigger, check)
   })

   const register = (el) => {
      return registry.add(new Element(el))
   }

   const registerBySelector = (selector) => {
      const elmts = document.querySelectorAll(selector)
      const on = (type, handler) => {
         elmts.forEach(el => {
            const elm = new Element(el)
            elm.on(type, handler)
            registry.add(elm)
         })
      }
      return {
         on
      }
   }

   return {
      register,
      registerBySelector
   }
}

module.exports = inView