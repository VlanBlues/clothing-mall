<!--
 * @Description: 确认订单页面组件
 -->
<template>
  <div class="confirmOrder">
    <!-- 头部 -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
        <router-link to></router-link>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容容器 -->
    <div class="content">
      <!-- 选择地址 -->
      <div class="section-address">
        <p class="title">收货地址</p>
        <div class="address-body">
          <ul>
            <li
                    v-for="(item,index) in address"
                    :key="index"
                    @click="liClick(index)"
                    :class="index === confirmAddress ? 'in-section' : ''"
            >
              <h2>{{item.name}}</h2>
              <p class="phone">{{item.mobile}}</p>
              <p class="address">{{item.province}}/{{item.city}}/{{item.area}}</p>
              <p class="address">{{item.address}}</p>
              <span class="el-icon-circle-close" @click="delAddr(item.addressId)"></span>
            </li>
            <li class="add-address" @click="dialogFormVisible = true">
              <i class="el-icon-circle-plus-outline"></i>
              <p>添加新地址</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 选择地址END -->

      <!-- 商品及优惠券 -->
      <div class="section-goods">
        <p class="title">商品及优惠券</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckGoods" :key="item.cartId">
              <img :src="item.goods.picUrl"/>
              <span class="pro-name">{{item.goods.name}}</span>
              <span class="pro-price">{{item.goods.retailPrice}}元 x {{item.goodsNum}}</span>
              <span class="pro-status"></span>
              <span class="pro-total">{{item.goods.retailPrice * item.goodsNum}}元</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 商品及优惠券END -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">包邮</p>
      </div>
      <!-- 配送方式END -->

      <!-- 发票 -->
      <div class="section-invoice">
        <p class="title">发票</p>
        <p class="invoice">电子发票</p>
        <p class="invoice">个人</p>
        <p class="invoice">商品明细</p>
      </div>
      <!-- 发票END -->

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="message">
          <p>留言</p>
          <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入留言"
                  v-model="message">
          </el-input>
        </div>
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{getCheckNum}}件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{getTotalPrice}}元</span>
            </li>
            <li>
              <span class="title">活动优惠：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">优惠券抵扣：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">运费：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{getTotalPrice}}</span>元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结算列表END -->

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCart" class="btn-base btn-return">返回购物车</router-link>
          <a @click="addOrder" class="btn-base btn-primary">结算</a>
        </div>
      </div>
      <!-- 结算导航END -->
    </div>
    <!-- 主要内容容器END -->
    <!--添加地址-->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="addr" label-position="left">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="addr.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="addr.mobile" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-cascader style="width: 100%" ref="myCascader" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input type="textarea" :role="1" v-model="addr.address" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddr">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {mapActions} from "vuex";
  import {addOrder} from "@/api/order"
  import {addAddress , getAddressByUserId} from "@/api/address"
  let pca = require("@/assets/pca-code.json")
  export default {
    name: "",
    data() {
      return {
        options: pca,
        selectedOptions:[],
        dialogFormVisible: false,
        message:'',
        //用于添加地址
        addr: {
          userId:this.$store.getters.getUser.userId,
          name: '',
          mobile: '',
          province: '',
          city:'',
          area:'',
          address:''
        },
        formLabelWidth: '70px',
        confirmAddress: 0, // 选择的地址id
        // 地址列表
        address: [
          {
            addr_id: 2,
            name: "蓝同学",
            mobile: "13580018623",
            address: "浙江省 宁波市 海曙区",
            province: '',
            city:'',
            area:''
          }
        ]
      };
    },
    created() {
      // 如果没有勾选购物车商品直接进入确认订单页面,提示信息并返回购物车
      if (this.getCheckNum < 1) {
        this.notifyError("请勾选商品后再结算");
        this.$router.push({path: "/shoppingCart"});
      }
      console.log('get----------')
      this.getAddrByUser()
    },
    computed: {
      // 结算的商品数量; 结算商品总计; 结算商品信息
      ...mapGetters(["getCheckNum", "getTotalPrice", "getCheckGoods"])
    },
    methods: {
      ...mapActions(["deleteShoppingCart"]),
      handleChange(value){
        console.log('selectedOptions',this.selectedOptions)
        console.log(value)
      },
      getAddrByUser(){
        getAddressByUserId({
            userId: this.$store.getters.getUser.userId
          })
          .then(res => {
            if (res.data.code === 200) {
              this.address = res.data.data
              console.log('get address',res.data.data)
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
      },
      delAddr(id){
        this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios
            .post("/api/addr/del", {
              addr_id: id
            })
            .then(res => {
              if (res.data.code === "001") {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
              this.getAddrByUser()
            })
            .catch(err => {
              return Promise.reject(err);
            });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addAddr() {
        // this.address.push(this.form)
        let label = this.$refs.myCascader.getCheckedNodes()[0].pathLabels
        this.addr.province = label[0]
        this.addr.city = label[1]
        this.addr.area = label[2]
        console.log(this.addr)
        addAddress(this.addr).then(res => {
          if(res.data.code === 200){
            this.$notify({
              title: '成功',
              message: '地址添加成功！！！',
              type: 'success'
            });
            this.getAddrByUser()
            this.dialogFormVisible = false
          }
        }).catch(err => {
          this.$notify({
            title: '失败',
            message: '地址添加失败！！！',
            type: 'error'
          });
        });
        
      },
      addOrder() {
        console.log('this.getCheckGoods',this.getCheckGoods)
        addOrder({
          userId:this.$store.getters.getUser.userId,
          cartList:this.getCheckGoods,
          addressId:this.address[this.confirmAddress].addressId,
          orderPrice:this.getTotalPrice
        }).then(res =>{
          if(res.data.code === 200){
            for(let check of this.getCheckGoods){
              this.deleteShoppingCart(check.cartId);
            }
            // 提示结算结果
            this.notifySucceed(res.data.msg);
            // 跳转我的订单页面
            this.$router.push({path: "/order"});
          }
        })
        /*this.$axios
          .post("/api/user/order/addOrder", {
            user_id: this.$store.getters.getUser.user_id,
            products: this.getCheckGoods
          })
          .then(res => {
            let products = this.getCheckGoods;
            switch (res.data.code) {
              // “001”代表结算成功
              case "001":
                for (let i = 0; i < products.length; i++) {
                  const temp = products[i];
                  // 删除已经结算的购物车商品
                  this.deleteShoppingCart(temp.id);
                }
                // 提示结算结果
                this.notifySucceed(res.data.msg);
                // 跳转我的订单页面
                this.$router.push({path: "/order"});
                break;
              default:
                // 提示失败信息
                this.notifyError(res.data.msg);
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });*/
      },
      liClick(index) {
        this.confirmAddress = index
      }
    }
  };
</script>
<style scoped>
  .confirmOrder {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }

  /* 头部CSS */
  .confirmOrder .confirmOrder-header {
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
  }

  .confirmOrder .confirmOrder-header .header-content {
    width: 1225px;
    margin: 0 auto;
    height: 80px;
  }

  .confirmOrder .confirmOrder-header .header-content p {
    float: left;
    font-size: 28px;
    line-height: 80px;
    color: #424242;
    margin-right: 20px;
  }

  .confirmOrder .confirmOrder-header .header-content p i {
    font-size: 45px;
    color: #ff6700;
    line-height: 80px;
  }

  /* 头部CSS END */

  /* 主要内容容器CSS */
  .confirmOrder .content {
    width: 1245px;
    margin: 0 auto;
    padding: 48px 0 0;
    background-color: #fff;
  }

  /* 选择地址CSS */
  .confirmOrder .content .section-address {
    margin: 0 48px;
    overflow: hidden;
  }

  .confirmOrder .content .section-address .title {
    color: #333;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 20px;
  }

  .confirmOrder .content .address-body li {
    float: left;
    position: relative;
    color: #333;
    width: 220px;
    height: 178px;
    border: 1px solid #e0e0e0;
    padding: 15px 24px 0;
    margin-right: 17px;
    margin-bottom: 24px;
    transition: all 0.5s;
  }

  .confirmOrder .content .address-body li:hover {
    cursor: pointer;
    border: 1px solid #6f99e0;
    

  }

  .confirmOrder .content .address-body li span {
    display: none;
    height: 20px;
    position: absolute;
    right: 10px;
    top: 10px;
    color: #6f99e0;
  }

  .confirmOrder .content .address-body li:hover span{
    display: block;
  }
  
  .confirmOrder .content .address-body .in-section {
    border: 1px solid #6f99e0;
  }

  .confirmOrder .content .address-body li h2 {
    font-size: 18px;
    font-weight: normal;
    line-height: 30px;
    margin-bottom: 10px;
  }

  .confirmOrder .content .address-body li p {
    font-size: 14px;
    color: #757575;
  }

  .confirmOrder .content .address-body li .address {
    padding: 10px 0;
    max-height: 88px;
    line-height: 22px;
    overflow: hidden;
  }

  .confirmOrder .content .address-body .add-address {
    text-align: center;
    line-height: 30px;
  }

  .confirmOrder .content .address-body .add-address i {
    font-size: 30px;
    padding-top: 50px;
    text-align: center;
  }

  /* 选择地址CSS END */

  /* 商品及优惠券CSS */
  .confirmOrder .content .section-goods {
    margin: 0 48px;
  }

  .confirmOrder .content .section-goods p.title {
    color: #333;
    font-size: 18px;
    line-height: 40px;
  }

  .confirmOrder .content .section-goods .goods-list {
    padding: 5px 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }

  .confirmOrder .content .section-goods .goods-list li {
    padding: 10px 0;
    color: #424242;
    overflow: hidden;
  }

  .confirmOrder .content .section-goods .goods-list li img {
    float: left;
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .confirmOrder .content .section-goods .goods-list li .pro-name {
    float: left;
    width: 650px;
    line-height: 30px;
  }

  .confirmOrder .content .section-goods .goods-list li .pro-price {
    float: left;
    width: 150px;
    text-align: center;
    line-height: 30px;
  }

  .confirmOrder .content .section-goods .goods-list li .pro-status {
    float: left;
    width: 99px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .confirmOrder .content .section-goods .goods-list li .pro-total {
    float: left;
    width: 190px;
    text-align: center;
    color: #ff6700;
    line-height: 30px;
  }

  /* 商品及优惠券CSS END */

  /* 配送方式CSS */
  .confirmOrder .content .section-shipment {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .confirmOrder .content .section-shipment .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
  }

  .confirmOrder .content .section-shipment .shipment {
    float: left;
    line-height: 38px;
    font-size: 14px;
    color: #ff6700;
  }

  /* 配送方式CSS END */

  /* 发票CSS */
  .confirmOrder .content .section-invoice {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .confirmOrder .content .section-invoice .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
  }

  .confirmOrder .content .section-invoice .invoice {
    float: left;
    line-height: 38px;
    font-size: 14px;
    margin-right: 20px;
    color: #ff6700;
  }

  /* 发票CSS END */

  /* 结算列表CSS */
  .confirmOrder .content .section-count {
    margin: 0 48px;
    padding: 20px 0;
    overflow: hidden;
  }
  .section-count >div{
    display: inline-block;
  }

  .confirmOrder .content .section-count .money-box {
    float: right;
    text-align: right;
  }
  .section-count .message{
    float: left;
    width: 60%;
  }
  .section-count .message p{
    margin-bottom: 20px;
  }

  .confirmOrder .content .section-count .money-box .title {
    float: left;
    width: 126px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #757575;
  }

  .confirmOrder .content .section-count .money-box .value {
    float: left;
    min-width: 105px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #ff6700;
  }

  .confirmOrder .content .section-count .money-box .total .title {
    padding-top: 15px;
  }

  .confirmOrder .content .section-count .money-box .total .value {
    padding-top: 10px;
  }

  .confirmOrder .content .section-count .money-box .total-price {
    font-size: 30px;
  }

  /* 结算列表CSS END */

  /* 结算导航CSS */
  .confirmOrder .content .section-bar {
    padding: 20px 48px;
    border-top: 2px solid #f5f5f5;
    overflow: hidden;
  }

  .confirmOrder .content .section-bar .btn {
    float: right;
  }

  .confirmOrder .content .section-bar .btn .btn-base {
    float: left;
    margin-left: 30px;
    width: 158px;
    height: 38px;
    border: 1px solid #b0b0b0;
    font-size: 14px;
    line-height: 38px;
    text-align: center;
  }

  .confirmOrder .content .section-bar .btn .btn-return {
    color: rgba(0, 0, 0, 0.27);
    border-color: rgba(0, 0, 0, 0.27);
  }

  .confirmOrder .content .section-bar .btn .btn-primary {
    background: #ff6700;
    border-color: #ff6700;
    color: #fff;
  }

  /* 结算导航CSS */

  /* 主要内容容器CSS END */
</style>