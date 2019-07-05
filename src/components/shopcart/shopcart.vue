<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <i
                class="icon-shopping_cart"
                :class="{ highlight: totalCount > 0 }"
              ></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">
            ¥{{ totalPrice }}
          </div>
          <div class="desc">另需配送费 ¥ {{ deliveryPrice }}元</div>
        </div>
        <!-- 阻止点击事件冒泡@click.stop.prevent="" -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{ payDesc }}</div>
        </div>
      </div>
      <div class="ball-container"></div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li
                class="food"
                v-for="(food, index) in selectFoods"
                :key="index"
              >
                <span class="name">{{ food.name }}</span>
                <div class="price">
                  <span>¥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'

export default {
  props: {
    // 从父组件goods中选取商品数量
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 0,
            count: 0
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      // 折叠
      fold: true
    }
  },
  components: {
    cartcontrol
  },
  // 以下计算属性均依赖selectFoods计算而来，状态根据selectFoods数据的改变而改变
  computed: {
    // 计算购物车商品总金额
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    // 计算购物车商品总数量
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 计算是否达到起送价
    payDesc () {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差¥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 未达到起送价和结算按钮切换
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    // 展开购物车详情
    listShow () {
      if (!this.totalCount) {
        // 没有购买任何商品为折叠状态
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.fold = true
        return false
      }
      let show = !this.fold
      // 购物车详情列表滚动展示
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    // 点击content区域展开购物车详情
    toggleList () {
      // 若购物车里面没东西，点击content区域为无效
      if (!this.totalCount) {
        return
      }
      // 否则对折叠状态取反，即当前为展开状态点击content区域则收起购物车详情
      this.fold = !this.fold
    },
    // 点击收起购物车
    hideList () {
      this.fold = true
    },
    // 清空购物车
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    // 结算按钮
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../util/stylus/mixin.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  background: #000;

  .content {
    display: flex;
    background: #141d27;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box; // 把borders和padding全都包含在定义的宽高里面
        vertical-align: top;
        border-radius: 50%; // 绘制外圈圆形效果
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 700;
        vertical-align: top;
        line-height: 24px;
        margin-top: 12px;
        box-sizing: border-box;
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, 0.1); // 绘制一条竖线

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin: 12px 0 0 12px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00b42c;
          color: #fff;
        }
      }
    }
  }

  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0); // 最终状态

    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s linear; // 动画效果
    }

    &.fold-enter, &.fold-leave-to {
      transform: translate3d(0, 0, 0); // 初始状态
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      background: #fff;
      overflow: hidden;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, 0.1));

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px); // 模糊效果
  background: rgba(7, 17, 27, 0.6);

  &.fade-enter-active, &.fade-leave-active {
    transition: opacity 0.5s;
  }

  &.fade-enter, &.fade-leave-to {
    opacity: 0;
  }
}
</style>
