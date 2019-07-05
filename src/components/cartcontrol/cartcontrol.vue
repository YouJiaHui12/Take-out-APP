<template>
  <div class="cartcontrol">
    <!-- 2.0版将transition="move"改为<transition></transition>标签嵌套 -->
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
import Vue from 'vue'
export default {
  // 传入food
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart () {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
.cartcontrol {
  font-size: 0;

  // 多重过渡效果（先平移后旋转）
  .cart-decrease {
    display: inline-block;
    padding: 6px;
    opacity: 1;

    .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
    }

    // 进入过渡的结束状态;离开过渡的结束状态(在整个进入或离开过程中都有效)
    &.move-enter-active, &.move-leave-active {
      transition: all 0.4s linear;

      .inner {
        transition: all 0.4s linear;
      }
    }

    // 进入过渡的开始状态;离开过渡的开始状态(只应用一帧后立即删除)
    &.move-enter, &.move-leave-to {
      opacity: 0; // 过渡刚进入和离开的时候透明度为0，即不显示
      transform: translate3d(24px, 0, 0);

      .inner {
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>
