<template>
  <div class="order">
    <!-- 我的订单头部 -->
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
          我的订单
        </p>
      </div>
    </div>
    <!-- 我的订单头部END -->
    <!-- 我的订单主要内容 -->
    <div class="order-content" v-if="orderList.length>0">
      <div class="content" v-for="(item,index) in orderList" :key="index">
        <ul>
          <!-- 我的订单表头 -->
          <li class="order-info">
            <div class="order-id">订单编号: {{item.orderSn}}</div>
            <div class="order-time">订单时间: {{item.addTime}}</div>
          </li>
          <li class="header">
            <div class="pro-img"></div>
            <div class="pro-name">商品名称</div>
            <div class="pro-price">单价</div>
            <div class="pro-num">数量</div>
            <div class="pro-total">小计</div>
          </li>
          <!-- 我的订单表头END -->

          <!-- 订单列表 -->
          <li class="product-list" v-for="(product,i) in item.goodsList" :key="i">
            <div class="pro-img">
              <router-link :to="{ path: '/goods/details', query: {goodsId:product.goodsId} }">
                <img :src="product.picUrl"/>
              </router-link>
            </div>
            <div class="pro-name" style="line-height: 20px; margin-top: 20px;">
              <router-link
                      :to="{ path: '/goods/details', query: {goodsId:product.goodsId} }"
              >{{product.name}}
              </router-link>
            </div>
            <div class="pro-price">{{product.retailPrice}}元</div>
            <div class="pro-num">{{product.buyNum}}</div>
            <div class="pro-total pro-total-in">{{product.retailPrice*product.buyNum}}元</div>
            <div>
              <el-button v-if="product.isComment === 0" size="mini" @click="rate(product.name,item.orderSn,product.goodsSn)">评价</el-button>
              <el-button v-else size="mini" disabled>已评价</el-button>
            </div>
          </li>
        </ul>
        <div class="order-bar">
          <div class="order-bar-left">
            <span class="order-total">
              共
              <span class="order-total-num">{{total[index].totalNum}}</span> 件商品
            </span>
          </div>
          <div class="order-bar-right">
            <span style="margin-right: 30px;color: #ff6700;font-size: 18px">
              <span v-if="item.shipTime === null">未发货</span>
              <span v-else>
                <span style="margin-right: 20px">已发货</span>
                <el-button type="warning" style="background-color: #ff6700" size="small">确认收货</el-button>
              </span>
            </span>

            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{total[index].totalPrice}}元</span>
            </span>
          </div>
          <!-- 订单列表END -->
        </div>
      </div>
      <div style="margin-top:-40px;"></div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="50%">
        <el-form ref="elForm" :model="comment" size="medium" label-width="100px">
          <el-form-item label="评论" prop="content">
            <el-input v-model="comment.content" type="textarea" placeholder="请输入评论"
                      :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
          </el-form-item>
          <el-form-item label="评分" prop="start">
            <el-rate v-model="comment.star" :max='5' :colors="colors"></el-rate>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmComment">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 我的订单主要内容END -->

    <!-- 订单为空的时候显示的内容 -->
    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的订单还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- 订单为空的时候显示的内容END -->
  </div>
</template>
<script>
  import {listByUser} from "@/api/order"
  import {addComment} from "@/api/comment"

  export default {
    data() {
      return {
        orderList: [],
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        test: [],// 订单列表
        total: [], // 每个订单的商品数量及总价列表,
        dialogVisible:false,
        dialogTitle:'评价',
        comment:{
          userId: this.$store.getters.getUser.userId,
          content:'',
          orderSn:'',
          goodsSn:'',
          star:0
        }
      };
    },
    methods:{
      rate(title,orderSn,goodsSn){
        this.comment.orderSn = orderSn;
        this.comment.goodsSn = goodsSn;
        this.dialogTitle = title;
        this.dialogVisible = true
      },
      confirmComment(){
        console.log('this.comment',this.comment)
        addComment(this.comment).then(res =>{
          if (res.data.code === 200){
            this.dialogVisible = false;
            this.getOrder()
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success'
            });
          }
        })
      },
      getOrder(){
        // 获取订单数据
        listByUser({
          userId: this.$store.getters.getUser.userId,
          current: 1,
          size: 10
        }).then(res => {
          if (res.data.code === 200) {
            console.log('order page', res.data.data)
            this.orderList = res.data.data.records;
            this.test = res.data.data.records
          } else {
            this.notifyError(res.data.msg);
          }
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }
    },
    activated() {
      this.getOrder()
    },
    watch: {
      // 通过订单信息，计算出每个订单的商品数量及总价
      orderList: function (val) {
        let total = [];
        for (let i = 0; i < val.length; i++) {
          const element = val[i].goodsList;

          let totalNum = 0;
          let totalPrice = 0;
          for (let j = 0; j < element.length; j++) {
            const temp = element[j];
            totalNum += temp.buyNum;
            totalPrice += temp.retailPrice * temp.buyNum;
          }
          total.push({totalNum, totalPrice});
        }
        this.total = total;
      }
    }
  };
</script>
<style>
  .el-rate {
    display: inline-block;
    vertical-align: text-top;
  }
</style>
<style scoped>
  .order {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }

  /* 我的订单头部CSS */
  .order .order-header {
    height: 64px;
    border-bottom: 2px solid #ff6700;
    background-color: #fff;
    margin-bottom: 20px;
  }

  .order .order-header .order-header-content {
    width: 1225px;
    margin: 0 auto;
  }

  .order .order-header p {
    font-size: 28px;
    line-height: 58px;
    float: left;
    font-weight: normal;
    color: #424242;
  }

  /* 我的订单头部CSS END */
  .order .content {
    width: 1225px;
    margin: 0 auto;
    background-color: #fff;
    margin-bottom: 50px;
  }

  .order .content ul {
    background-color: #fff;
    color: #424242;
    line-height: 85px;
  }

  /* 我的订单表头CSS */
  .order .content ul .order-info {
    height: 60px;
    line-height: 60px;
    padding: 0 26px;
    color: #424242;
    border-bottom: 1px solid #ff6700;
  }

  .order .content ul .order-info .order-id {
    float: left;
    color: #ff6700;
  }

  .order .content ul .order-info .order-time {
    float: right;
  }

  .order .content ul .header {
    height: 85px;
    padding-right: 26px;
    color: #424242;
  }

  /* 我的订单表头CSS END */

  /* 订单列表CSS */
  .order .content ul .product-list {
    height: 85px;
    padding: 15px 26px 15px 0;
    border-top: 1px solid #e0e0e0;
  }

  .order .content ul .pro-img {
    float: left;
    height: 85px;
    width: 120px;
    padding-left: 80px;
  }

  .order .content ul .pro-img img {
    height: 80px;
    width: 80px;
  }

  .order .content ul .pro-name {
    float: left;
    width: 380px;
  }

  .order .content ul .pro-name a {
    color: #424242;
  }

  .order .content ul .pro-name a:hover {
    color: #ff6700;
  }

  .order .content ul .pro-price {
    float: left;
    width: 140px;
    padding-right: 18px;
    text-align: center;
  }

  .order .content ul .pro-num {
    float: left;
    width: 140px;
    text-align: center;
  }

  .order .content ul .pro-total {
    float: left;
    width: 140px;
    padding-right: 80px;
    text-align: right;
  }

  .order .content ul .pro-total-in {
    color: #ff6700;
  }

  .order .order-bar {
    width: 1185px;
    padding: 0 20px;
    border-top: 1px solid #ff6700;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
  }

  .order .order-bar .order-bar-left {
    float: left;
  }

  .order .order-bar .order-bar-left .order-total {
    color: #757575;
  }

  .order .order-bar .order-bar-left .order-total-num {
    color: #ff6700;
  }

  .order .order-bar .order-bar-right {
    float: right;
  }

  .order .order-bar .order-bar-right .total-price-title {
    color: #ff6700;
    font-size: 14px;
  }

  .order .order-bar .order-bar-right .total-price {
    color: #ff6700;
    font-size: 30px;
  }

  /* 订单列表CSS END */

  /* 订单为空的时候显示的内容CSS */
  .order .order-empty {
    width: 1225px;
    margin: 0 auto;
  }

  .order .order-empty .empty {
    height: 300px;
    padding: 0 0 130px 558px;
    margin: 65px 0 0;
    background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
    color: #b0b0b0;
    overflow: hidden;
  }

  .order .order-empty .empty h2 {
    margin: 70px 0 15px;
    font-size: 36px;
  }

  .order .order-empty .empty p {
    margin: 0 0 20px;
    font-size: 20px;
  }

  /* 订单为空的时候显示的内容CSS END */
</style>
