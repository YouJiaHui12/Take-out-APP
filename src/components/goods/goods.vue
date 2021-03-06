<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- 2.0版将$index改为index，index为序号 -->
        <li
          v-for="(item, index) in goods"
          class="menu-item"
          :key="index"
          :class="{ current: currentIndex === index }"
          @click="selectMenu(index)"
        >
          <span class="text border-1px"
            ><span
              v-show="item.type > 0"
              class="icon"
              :class="classMap[item.type]"
            ></span
            >{{ item.name }}</span
          >
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          class="food-list food-list-hook"
          :key="index"
        >
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li
              @click="selectFood(food)"
              v-for="(food, index) in item.foods"
              class="food-item border-1px"
              :key="index"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span
                  ><span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice"
                    >¥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- 传递参数给cartcontrol组件 -->
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 联动购物车与商品，传递参数给shopcart组件 -->
    <shopcart
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
    ></shopcart>
    <!-- 商品详情覆盖层 -->
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [], // 存储区间高度
      scrollY: 0,
      selectedFood: {}
    }
  },
  // computed只在需要时更新
  computed: {
    // 计算滚动区间，变换css,当scrollY发生变化时，currentIndex会实时变化计算
    currentIndex () {
      // 遍历listHeight
      for (let i = 0; i < this.listHeight.length; i++) {
        // 获取上下区间的高度
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        // 判断是否为最后一个或落在区间，必须为向下闭区间，向上开区间，这样初始值才能高亮
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0 // 若listHeight没有的话，返回0
    },
    // 选中的商品
    selectFoods () {
      let foods = []
      // 遍历所有商品中每个分类下的food，判断商品数量是否大于零，找到所有被选择的商品
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        this.goods = response.data
        // vue是异步更新DOM，使用nextTick接口初始化函数,拿到数据后DOM更新操作函数
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  // methods里放需要点击时触发的函数
  methods: {
    // 左侧点击事件，将左侧Menu的index与右侧foodList数组的index对应起来
    selectMenu (index) {
      // vue2.0不需要判断是浏览器还是手机端
      // if (!event._constructed) {
      //   return;
      // }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
      console.log(index)
    },
    // 展开商品详情页
    selectFood (food) {
      this.selectedFood = food
      this.$refs.food.show() // 拿到子组件的show方法
    },
    // 滚动监听
    _initScroll () {
      // 监听ref的滚动，2.0版没有this.$els.menuWrapper，改为this.$refs.menuWrapper
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 设置可点击
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true, // 设置可点击
        probeType: 3 // 实时监测滚动位置
      })
      // foodsScroll监测scroll,scroll滚动时把位置实时暴露出来
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 计算右侧每个区域的高度
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  // 注册组件
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../../util/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  width: 100%;
  bottom: 46px;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table; // 无论一行还是两行都可垂直居中
      width: 56px;
      height: 54px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        margin-top: -1px;
        font-weight: 700;
        background: #fff;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        font-size: 12px;
        border-1px(rgba(7, 17, 27, 0.1));
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-radius: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          font-size: 14px;
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          font-size: 10px;
          line-height: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          margin-bottom: 8px;
          line-height: 12px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font: weight 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
