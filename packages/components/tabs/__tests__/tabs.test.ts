// @ts-nocheck
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { EVENT_CODE } from '@element-plus/constants'
import ElAffix from '@element-plus/components/affix'
import Tabs from '../src/tabs'
import TabPane from '../src/tab-pane.vue'
import TabNav from '../src/tab-nav'

describe('Tabs.vue', () => {
  test('create', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs>
          <el-tab-pane label="label-1">A</el-tab-pane>
          <el-tab-pane label="label-2">B</el-tab-pane>
          <el-tab-pane label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    const navWrapper = wrapper.findComponent(TabNav)
    const panesWrapper = wrapper.findAllComponents(TabPane)
    await nextTick()

    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper[0].classes('is-active')).toBe(true)
    expect(panesWrapper[0].classes('el-tab-pane')).toBe(true)
    expect(panesWrapper[0].attributes('id')).toBe('pane-0')
    expect(panesWrapper[0].attributes('aria-hidden')).toEqual('false')
    expect(tabsWrapper.vm.$.exposed.currentName.value).toEqual('0')

    await navItemsWrapper[2].trigger('click')
    expect(navItemsWrapper[0].classes('is-active')).toBe(false)
    expect(panesWrapper[0].attributes('aria-hidden')).toEqual('true')
    expect(navItemsWrapper[2].classes('is-active')).toBe(true)
    expect(panesWrapper[2].attributes('aria-hidden')).toEqual('false')
    expect(tabsWrapper.vm.$.exposed.currentName.value).toEqual('2')
  })

  test('active-name', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      data() {
        return {
          activeName: 'b',
        }
      },
      methods: {
        handleClick(tab) {
          this.activeName = tab.paneName
        },
      },
      template: `
        <el-tabs :active-name="activeName" @tab-click="handleClick">
          <el-tab-pane name="a" label="label-1">A</el-tab-pane>
          <el-tab-pane name="b" label="label-2">B</el-tab-pane>
          <el-tab-pane name="c" label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane name="d" label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    const navWrapper = wrapper.findComponent(TabNav)
    const panesWrapper = wrapper.findAllComponents(TabPane)
    await nextTick()

    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')
    expect(navItemsWrapper[1].classes('is-active')).toBe(true)
    expect(panesWrapper[1].classes('el-tab-pane')).toBe(true)
    expect(panesWrapper[1].attributes('id')).toBe('pane-b')
    expect(panesWrapper[1].attributes('aria-hidden')).toEqual('false')
    expect(tabsWrapper.vm.$.exposed.currentName.value).toEqual('b')

    await navItemsWrapper[2].trigger('click')
    expect(navItemsWrapper[1].classes('is-active')).toBe(false)
    expect(panesWrapper[1].attributes('aria-hidden')).toEqual('true')
    expect(navItemsWrapper[2].classes('is-active')).toBe(true)
    expect(panesWrapper[2].attributes('aria-hidden')).toEqual('false')
    expect(tabsWrapper.vm.$.exposed.currentName.value).toEqual('c')
  })

  test('card', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs type="card">
          <el-tab-pane label="label-1">A</el-tab-pane>
          <el-tab-pane label="label-2">B</el-tab-pane>
          <el-tab-pane label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    expect(tabsWrapper.classes('el-tabs--card')).toBe(true)
  })

  test('border card', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs type="border-card">
          <el-tab-pane label="label-1">A</el-tab-pane>
          <el-tab-pane label="label-2">B</el-tab-pane>
          <el-tab-pane label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    expect(tabsWrapper.classes('el-tabs--border-card')).toBe(true)
  })

  test('dynamic', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs type="card" ref="tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name">Test Content</el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          tabs: [
            {
              label: 'tab1',
              name: 'tab1',
            },
            {
              label: 'tab2',
              name: 'tab2',
            },
            {
              label: 'tab3',
              name: 'tab3',
            },
            {
              label: 'tab4',
              name: 'tab4',
            },
          ],
        }
      },
    })

    let navWrapper = wrapper.findComponent(TabNav)
    let panesWrapper = wrapper.findAllComponents(TabPane)
    await nextTick()

    let navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(4)
    expect(panesWrapper.length).toEqual(4)

    wrapper.vm.tabs.push({ label: 'tab5', name: 'tab5' })

    await nextTick()
    navWrapper = wrapper.findComponent(TabNav)
    panesWrapper = wrapper.findAllComponents(TabPane)
    navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(5)
    expect(panesWrapper.length).toEqual(5)
  })

  test('editable', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs ref="tabs" v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            {{item.content}}
          </el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          editableTabsValue: '2',
          editableTabs: [
            {
              title: 'Tab 1',
              name: '1',
              content: 'Tab 1 content',
            },
            {
              title: 'Tab 2',
              name: '2',
              content: 'Tab 2 content',
            },
            {
              title: 'Tab 3',
              name: '3',
              content: 'Tab 3 content',
            },
          ],
          tabIndex: 3,
        }
      },
      methods: {
        handleTabsEdit(targetName, action) {
          if (action === 'add') {
            const newTabName = `${++this.tabIndex}`
            this.editableTabs.push({
              title: 'New Tab',
              name: newTabName,
              content: 'New Tab content',
            })
            this.editableTabsValue = newTabName
          }
          if (action === 'remove') {
            const tabs = this.editableTabs
            let activeName = this.editableTabsValue
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                  const nextTab = tabs[index + 1] || tabs[index - 1]
                  if (nextTab) {
                    activeName = nextTab.name
                  }
                }
              })
            }
            this.editableTabsValue = activeName
            this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
          }
        },
      },
    })

    const navWrapper = wrapper.findComponent(TabNav)
    let panesWrapper = wrapper.findAllComponents(TabPane)
    await nextTick()

    let navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(3)
    expect(panesWrapper.length).toEqual(3)
    expect(navItemsWrapper[1].classes('is-active')).toBe(true)

    // remove one tab, check panes length
    await navItemsWrapper[1].find('.is-icon-close').trigger('click')

    panesWrapper = wrapper.findAllComponents(TabPane)
    navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(2)
    expect(panesWrapper.length).toEqual(2)

    // add one tab, check panes length and current tab
    await wrapper.find('.el-tabs__new-tab').trigger('click')

    panesWrapper = wrapper.findAllComponents(TabPane)
    navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(3)
    expect(panesWrapper.length).toEqual(3)
    expect(navItemsWrapper[2].classes('is-active')).toBe(true)
  })

  test('addable & closable', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs
          ref="tabs"
          v-model="editableTabsValue"
          type="card"
          addable
          closable
          @tab-add="addTab"
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :key="item.name"
            :name="item.name"
          >
            {{item.content}}
          </el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          editableTabsValue: '2',
          editableTabs: [
            {
              title: 'Tab 1',
              name: '1',
              content: 'Tab 1 content',
            },
            {
              title: 'Tab 2',
              name: '2',
              content: 'Tab 2 content',
            },
          ],
          tabIndex: 2,
        }
      },
      methods: {
        addTab() {
          const newTabName = `${++this.tabIndex}`
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content',
          })
          this.editableTabsValue = newTabName
        },
        removeTab(targetName) {
          const tabs = this.editableTabs
          let activeName = this.editableTabsValue
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          this.editableTabsValue = activeName
          this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
        },
      },
    })

    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()

    await wrapper.find('.el-tabs__new-tab').trigger('click')

    let navItemsWrapper = navWrapper.findAll('.el-tabs__item')
    let panesWrapper = wrapper.findAllComponents(TabPane)
    expect(navItemsWrapper.length).toEqual(3)
    expect(panesWrapper.length).toEqual(3)
    expect(navItemsWrapper[2].classes('is-active')).toBe(true)

    await navItemsWrapper[2].find('.is-icon-close').trigger('click')

    panesWrapper = wrapper.findAllComponents(TabPane)
    navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper.length).toEqual(2)
    expect(panesWrapper.length).toEqual(2)
  })

  test('closable in tab-pane', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs type="card" ref="tabs">
          <el-tab-pane label="label-1" closable>A</el-tab-pane>
          <el-tab-pane label="label-2">B</el-tab-pane>
          <el-tab-pane label="label-3" closable>C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()

    expect(navWrapper.findAll('.is-icon-close').length).toBe(2)
  })

  test('disabled', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs type="card" ref="tabs">
          <el-tab-pane label="label-1">A</el-tab-pane>
          <el-tab-pane disabled label="label-2" ref="disabled">B</el-tab-pane>
          <el-tab-pane label="label-3">C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()
    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')
    expect(navItemsWrapper[1].classes('is-active')).toBe(false)

    await navItemsWrapper[1].trigger('click')
    expect(navItemsWrapper[1].classes('is-active')).toBe(false)
  })

  test('tab-position', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs ref="tabs" tab-position="left">
          <el-tab-pane label="label-1">A</el-tab-pane>
          <el-tab-pane label="label-2">B</el-tab-pane>
          <el-tab-pane label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    await nextTick()

    expect(tabsWrapper.classes('el-tabs--left')).toBe(true)
    expect(tabsWrapper.find('.el-tabs__header').classes('is-left')).toBe(true)
    expect(tabsWrapper.find('.el-tabs__nav-wrap').classes('is-left')).toBe(true)
    expect(tabsWrapper.find('.el-tabs__nav').classes('is-left')).toBe(true)
    expect(tabsWrapper.find('.el-tabs__active-bar').classes('is-left')).toBe(
      true
    )
    expect(tabsWrapper.find('.el-tabs__item').classes('is-left')).toBe(true)
  })

  test('stretch', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
      <el-tabs ref="tabs" stretch :tab-position="tabPosition">
        <el-tab-pane label="label-1">A</el-tab-pane>
        <el-tab-pane label="label-2">B</el-tab-pane>
        <el-tab-pane label="label-3">C</el-tab-pane>
        <el-tab-pane label="label-4">D</el-tab-pane>
      </el-tabs>
      `,
      data() {
        return {
          tabPosition: 'bottom',
        }
      },
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    await nextTick()

    expect(tabsWrapper.find('.el-tabs__nav').classes('is-stretch')).toBe(true)

    wrapper.vm.tabPosition = 'left'
    await nextTick()

    expect(tabsWrapper.find('.el-tabs__nav').classes('is-stretch')).toBe(false)
  })

  test('tab active bar offset', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
      <el-tabs ref="tabs" stretch :tab-position="tabPosition">
        <el-tab-pane label="label-1" name="A">A</el-tab-pane>
        <el-tab-pane label="label-2" name="B">B</el-tab-pane>
        <el-tab-pane label="label-3" name="C">C</el-tab-pane>
        <el-tab-pane label="label-4" name="D">D</el-tab-pane>
      </el-tabs>
      `,
      data() {
        return {
          tabPosition: 'bottom',
        }
      },
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    await nextTick()
    const mockCRect = vi
      .spyOn(wrapper.find('#tab-C').element, 'getBoundingClientRect')
      .mockReturnValue({ left: 300 } as DOMRect)
    const mockComputedStyle = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ paddingLeft: '0px' } as CSSStyleDeclaration)
    await wrapper.find('#tab-C').trigger('click')

    await nextTick()
    expect(tabsWrapper.find('.el-tabs__active-bar').attributes().style).toMatch(
      'translateX(300px)'
    )

    wrapper.vm.tabPosition = 'left'
    await nextTick()
    const mockCYRect = vi
      .spyOn(wrapper.find('#tab-C').element, 'getBoundingClientRect')
      .mockReturnValue({ top: 200 } as DOMRect)
    await wrapper.find('#tab-A').trigger('click')
    await wrapper.find('#tab-C').trigger('click')

    await nextTick()
    expect(tabsWrapper.find('.el-tabs__active-bar').attributes().style).toMatch(
      'translateY(200px)'
    )

    mockCRect.mockRestore()
    mockCYRect.mockRestore()
    mockComputedStyle.mockRestore()
    wrapper.unmount()
  })

  test('horizonal-scrollable', async () => {
    // TODO: jsdom not support `clientWidth`.
  })

  test('vertical-scrollable', async () => {
    // TODO: jsdom not support `clientWidth`.
  })

  test('should work with lazy', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs v-model="activeName" ref="tabs">
          <el-tab-pane label="label-1" lazy name="A">A</el-tab-pane>
          <el-tab-pane label="label-2" name="B">B</el-tab-pane>
          <el-tab-pane label="label-3" name="C">C</el-tab-pane>
          <el-tab-pane label="label-4" lazy name="D">D</el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          activeName: 'A',
        }
      },
    })

    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()
    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(wrapper.findAll('.el-tab-pane').length).toBe(3)

    await navItemsWrapper[3].trigger('click')

    expect(wrapper.findAll('.el-tab-pane').length).toBe(4)
  })

  test('before leave', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs ref="tabs" v-model="activeName" :before-leave="beforeLeave">
          <el-tab-pane name="tab-A" label="label-1">A</el-tab-pane>
          <el-tab-pane name="tab-B" label="label-2">B</el-tab-pane>
          <el-tab-pane name="tab-C" label="label-3">C</el-tab-pane>
          <el-tab-pane name="tab-D" label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          activeName: 'tab-B',
        }
      },
      methods: {
        beforeLeave() {
          return new window.Promise((resolve, reject) => {
            reject()
          })
        },
      },
    })

    const navWrapper = wrapper.findComponent(TabNav)
    const panesWrapper = wrapper.findAllComponents(TabPane)
    await nextTick()
    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')

    expect(navItemsWrapper[1].classes('is-active')).toBe(true)
    expect(panesWrapper[1].attributes('style')).toBeFalsy()

    await navItemsWrapper[3].trigger('click')

    expect(navItemsWrapper[1].classes('is-active')).toBe(true)
    expect(panesWrapper[1].attributes('style')).toBeFalsy()
  })

  test('keyboard event', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs v-model="activeName">
          <el-tab-pane label="label-1" name="first" disabled>A</el-tab-pane>
          <el-tab-pane label="label-2" name="second">B</el-tab-pane>
          <el-tab-pane label="label-3" name="third">C</el-tab-pane>
          <el-tab-pane label="label-4" name="fourth">D</el-tab-pane>
        </el-tabs>
      `,
      data() {
        return {
          activeName: 'second',
        }
      },
    })

    const vm = wrapper.vm
    await nextTick()

    await wrapper
      .find('#tab-second')
      .trigger('keydown', { code: EVENT_CODE.right })
    expect(vm.activeName).toEqual('third')

    await wrapper
      .find('#tab-third')
      .trigger('keydown', { code: EVENT_CODE.right })
    expect(vm.activeName).toEqual('fourth')

    await wrapper
      .find('#tab-fourth')
      .trigger('keydown', { code: EVENT_CODE.right })
    expect(vm.activeName).toEqual('second')

    await wrapper
      .find('#tab-second')
      .trigger('keydown', { code: EVENT_CODE.left })
    expect(vm.activeName).toEqual('fourth')
  })

  test('resize', async () => {
    // TODO: jsdom not support `clientWidth`.
  })

  test('DOM update finished calculating navOffset', async () => {
    const tabs: string[] = []
    for (let i = 0; i < 5000; i++) {
      tabs.push(i.toString())
    }
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      template: `
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-for="item in tabs"
            :key="item"
            :label="item"
            :name="item"
          />
        </el-tabs>
      `,
      data() {
        return {
          activeName: '0',
          tabs,
        }
      },
    })

    const tabsWrapper = wrapper.findComponent(Tabs)
    await nextTick()

    const mockRect = vi
      .spyOn(wrapper.find('#tab-4999').element, 'getBoundingClientRect')
      .mockReturnValue({ left: 5000 } as DOMRect)
    const mockComputedStyle = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ paddingLeft: '0px' } as CSSStyleDeclaration)

    await wrapper.find('#tab-4999').trigger('click')
    await nextTick()

    expect(tabsWrapper.find('.el-tabs__active-bar').attributes().style).toMatch(
      'translateX(5000px)'
    )

    mockRect.mockRestore()
    mockComputedStyle.mockRestore()
    wrapper.unmount()
  })

  test('value type', async () => {
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
      },
      data() {
        return {
          activeName: 0,
        }
      },
      methods: {
        handleClick(tab) {
          this.activeName = tab.paneName
        },
      },
      template: `
        <el-tabs :active-name="activeName" @tab-click="handleClick">
          <el-tab-pane :name="0" label="label-1">A</el-tab-pane>
          <el-tab-pane :name="1" label="label-2">B</el-tab-pane>
          <el-tab-pane :name="2" label="label-3" ref="pane-click">C</el-tab-pane>
          <el-tab-pane :name="3" label="label-4">D</el-tab-pane>
        </el-tabs>
      `,
    })

    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()

    const navItemsWrapper = navWrapper.findAll('.el-tabs__item')
    ;[1, 0, 2, 0, 3, 0, 1].forEach((val) => {
      navItemsWrapper[val].trigger('click')
      expect(wrapper.vm.activeName).toEqual(val)
    })
  })

  test('wrappable tabs', async () => {
    const random = Math.random() * 10
    const wrapper = mount({
      components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
        'el-affix': ElAffix,
      },
      data() {
        return {
          activeName: 0,
          tabWrapper: undefined,
          tabWrapperProps: {
            offset: random,
          },
        }
      },
      template: `
        <el-tabs :active-name="activeName" :tab-wrapper="tabWrapper" :tab-wrapper-props="tabWrapperProps">
          <el-tab-pane :name="0" label="label-1">A</el-tab-pane>
          <el-tab-pane :name="1" label="label-2">B</el-tab-pane>
        </el-tabs>
      `,
    })

    const noAffixWrapper = wrapper.findAll('.el-affix')
    expect(noAffixWrapper.length).eq(0)
    wrapper.vm.tabWrapper = ElAffix
    await nextTick()
    const affixWrapper = wrapper.findAll('.el-affix')
    expect(affixWrapper.length).eq(1)
    const navWrapper = wrapper.findComponent(TabNav)
    await nextTick()
    const navItemsWrapper = navWrapper.findAll('.el-affix .el-tabs__item')
    expect(navItemsWrapper.length).eq(2)
  })
})
