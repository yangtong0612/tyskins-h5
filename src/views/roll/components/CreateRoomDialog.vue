<template>
  <v-dialog>
	  <div class="popupbox">
	  	<div class="header">
	  		<div>{{ isEdit ? "编辑" : "创建" }}Roll房间</div>
	  		<img @click="close" class="cursor" style="width: 20px;" src="/src/assets/img/closeX.png" alt="">
	  	</div>
	  	<div class="body">
	  		<div class="content mt-3">
	  		  <div class="tip my-6 fs14 text-gray">roll房功能仅限于网站活动，玩家福利发放，请勿用于私下交换饰品等风险活动，避免上当受骗</div>
	  		  <el-form
	  		    label-width="80px"
	  		    size="small"
	  		    class="mt-3"
	  		    ref="formComponent"
	  		    :model="form"
	  		    :rules="rules"
	  		  >
	  		    <el-form-item label="房间名称" prop="room_name">
	  		      <el-input placeholder="输入房间名称" v-model="form.room_name" clearable maxlength="100"></el-input>
	  		    </el-form-item>
	  		    <el-form-item label="房间描述" prop="room_desc">
	  		      <el-input
	  		        type="textarea"
	  		        placeholder="输入房间描述"
	  		        v-model="form.room_desc"
	  		        clearable
	  		        maxlength="100"
	  		        show-word-limit
	  		      ></el-input>
	  		    </el-form-item>
	  		    <v-row :no-gutters="isMobile">
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="最大参与人数" label-width="109px" prop="max_join_num">
	  		          <el-input-number :min="100" v-model="form.max_join_num" step-strictly></el-input-number>
	  		        </el-form-item>
	  		      </v-col>
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="限时充值门槛" label-width="109px" prop="recharge_amount">
	  		          <el-input-number :min="0" v-model="form.recharge_amount"></el-input-number>
	  		        </el-form-item>
	  		      </v-col>
	  		    </v-row>
	  		    <v-row :no-gutters="isMobile">
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="开始时间" prop="start_time">
	  		          <el-date-picker
	  						  :teleported="false"
	  		            placeholder="请选择时间"
	  		            v-model="form.start_time"
	  		            type="datetime"
	  		            :disabledDate="getTimeStatus"
	  		          ></el-date-picker>
	  		        </el-form-item>
	  		      </v-col>
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="开奖时间" prop="lottery_time">
	  		          <el-date-picker
					  :teleported="false"
	  		            placeholder="请选择时间"
	  		            v-model="form.lottery_time"
	  		            type="datetime"
	  		            :disabledDate="getTimeStatus"
	  		          ></el-date-picker>
	  		        </el-form-item>
	  		      </v-col>
	  		    </v-row>
	  		    <v-row :no-gutters="isMobile" v-if="form.recharge_amount > 0">
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="充值限制开始时间" label-width="136px" prop="recharge_start_time">
	  		          <el-date-picker
					  :teleported="false"
	  		            placeholder="请选择时间"
	  		            v-model="form.recharge_start_time"
	  		            type="datetime"
	  		          ></el-date-picker>
	  		        </el-form-item>
	  		      </v-col>
	  		      <v-col cols="12" md="6">
	  		        <el-form-item label="充值限制结束时间" label-width="136px" prop="recharge_end_time">
	  		          <el-date-picker
					  :teleported="false"
	  		            placeholder="请选择时间"
	  		            v-model="form.recharge_end_time"
	  		            type="datetime"
	  		          ></el-date-picker>
	  		        </el-form-item>
	  		      </v-col>
	  		    </v-row>
	  		    <v-row :no-gutters="isMobile" v-if="!isCancelPassword">
	  		      <v-col cols="6">
	  		        <el-form-item label="房间类型">
	  		          <el-select :teleported="false" v-model="form.is_promotion" placeholder="请选择房间类型">
	  		          	<el-option label="普通房" :value="0"></el-option>
	  		          	<el-option label="推广房" :value="1"></el-option>
	  		          </el-select>
	  		        </el-form-item>
	  		      </v-col>
	  		      <v-col cols="6 d-flex">
	  		        <el-form-item label-width="0">
	  		          <el-checkbox v-model="usePassword">
	  		            <span class="text-gray">
	  		              {{
	  		                isEdit && isPasswordRoom ? "设置新密码" : "房间密码"
	  		              }}
	  		            </span>
	  		          </el-checkbox>
	  		        </el-form-item>
	  		        <el-form-item style="flex: 1" label-width="10px" v-if="usePassword">
	  		          <el-input
	  		            :placeholder="
	  		              isEdit && isPasswordRoom
	  		                ? '输入新的房间密码 留空不修改 (取消密码请勾选下方选项)'
	  		                : '输入房间密码 (不设置留空)'
	  		            "
	  		            v-model="form.room_pass"
	  		            clearable
	  		          ></el-input>
	  		        </el-form-item>
	  		      </v-col>
	  		    </v-row>
	  		
	  		    <el-checkbox v-if="isEdit && isPasswordRoom" v-model="isCancelPassword">
	  		      <span class="text-gray">取消房间密码</span>
	  		    </el-checkbox>
	  		  </el-form>
	  		</div>
	  	</div>
	  	<div class="footer">
	  		 <v-btn elevation="0" color="primary" @click="submit">{{ isEdit ? "编辑" : "创建" }}房间</v-btn>
	  	</div>
	  </div>
    
  </v-dialog>
</template>

<script lang="ts">
import { RollService } from "@/services/RollService";
import { CreateRoomForm, RoomDetail } from "@/types/roll";
import { defineComponent, ref, reactive } from "vue";

class TextRule {
  public message;
  public required;
  constructor(message: string, required = true) {
    this.message = "必须输入" + message;
    this.required = required;
  }
}

class NumberRule {
  public message;
  public validator;
  public required = true;
  constructor(min: number) {
    this.message = "您输入的值不符合要求, 最小" + min;
    this.validator = (rule, value, callback: (error?: Error) => void) => {
      const n = Number(value);
      if (isNaN(n)) {
        callback(new Error("请输入正确的数字"));
      }
      if (value < min) {
        callback(new Error("数字不能小于" + min));
      }
      callback();
    };
  }
}

class TimeRule {
  public message = "请选择时间";
  public required = true;
  public validator;
  public trigger = "change";
  constructor() {
    this.validator = (rule, value, callback: (error?: Error) => void) => {
      if (!value) {
        callback(new Error(this.message));
      }
      callback();
    };
  }
}

interface FormTime {
  start_time: number;
  lottery_time: number;
  recharge_start_time: number;
  recharge_end_time: number;
}

export default defineComponent({
  setup() {
    return {
	  dialog: ref(false),
      isMobile: window.screen.width <= 900,
      usePassword: ref(false),
      time: reactive({
        start_time: "",
        lottery_time: "",
        recharge_start_time: "",
        recharge_end_time: "",
      }),
      form: reactive<CreateRoomForm>({
        room_name: "",
        room_desc: "",
        room_pass: "",
        max_join_num: 100,
        start_time: "",
        lottery_time: "",
        recharge_start_time: "",
        recharge_end_time: "",
        recharge_amount: 0,
        is_promotion: 1,
      }),
      rules: {
        room_name: new TextRule("房间名称"),
        join_num: new NumberRule(10),
        recharge_amount: new NumberRule(0),
        max_join_num: new NumberRule(100),
        start_time: new TimeRule(),
        lottery_time: new TimeRule(),
        recharge_start_time: new TimeRule(),
        recharge_end_time: new TimeRule(),
      },
      isEdit: ref(false),
      isCancelPassword: ref(false),
      isPasswordRoom: ref(false),
    };
  },

  methods: {
    handleCreate() {
      const form = this.$refs.formComponent as any;
      form.validate((valid) => {
        if (valid) {
          this.createRoom();
        } else {
          this.$notify.warning("请按照提示填写所需内容");
          return false;
        }
      });
    },

    submit() {
      this.checkAndProcessTime().then((res) => {
        const {
          start_time,
          lottery_time,
          recharge_start_time,
          recharge_end_time,
        } = res;
        const data = Object.assign({}, this.form, {
          start_time,
          lottery_time,
          recharge_start_time,
          recharge_end_time,
        });
        const task = this.isEdit ? this.editRoom(data) : this.createRoom(data);
        task.then(() => {
          this.$emit("refresh");
        });
      });
    },

    createRoom(data) {
      return RollService.createRoom(data).then((res) => {
        if (res.data.code === 0) {
          // @ts-ignore
          window.autoOpenPushDialog = true;
          this.$router.push("/roll/" + res.data.data.id);
          this.$notify.success("创建房间成功");
          this.close();
        }
      });
    },

    editRoom(data: CreateRoomForm) {
      const {
        room_name,
        room_desc,
        room_pass,
        max_join_num,
        start_time,
        lottery_time,
        recharge_amount,
        recharge_start_time,
        recharge_end_time,
      } = data;

      const formData = {
        room_name,
        room_desc,
        max_join_num,
        start_time,
        lottery_time,
        recharge_amount,
        recharge_start_time,
        recharge_end_time,
        room_pass,
        room_id: this.roomId,
      };

      if (this.isCancelPassword) {
        // @ts-ignore
        delete formData.room_pass;
      }

      return RollService.editRoom(formData).then(() => {
        this.$notify.success("成功");
        this.close();
      });
    },

    close() {
      this.$emit("close");
      this.isCancelPassword = false;
      this.usePassword = false;
      setTimeout(() => {
        const form = this.$refs.formComponent as any;
        // form.resetFields();
      }, 300);
    },

    checkAndProcessTime(): Promise<FormTime> {
      const fields = [
        "start_time",
        "lottery_time",
        "recharge_start_time",
        "recharge_end_time",
      ];
      // @ts-ignore
      const time: FormTime = {};
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        time[field] = this.processTime(this.form[field]);
      }
      if (this.form.recharge_amount === 0 && time.start_time) {
        const now = new Date(time.start_time * 1000);
        now.setHours(now.getHours() - 1);
        time.recharge_end_time = this.processTime(now);
        now.setHours(now.getHours() - 1);
        time.recharge_start_time = this.processTime(now);
      }
      return new Promise((resolve, reject) => {
        // 充值时间校验
        if (time.recharge_end_time > time.lottery_time) {
          console.log(time.recharge_end_time, time.lottery_time);
          this.$notify.warning("充值结束时间不可晚于开奖时间");
          reject();
          return;
        }
        if (time.recharge_start_time > time.recharge_end_time) {
          this.$notify.warning("充值限制结束时间不能早于充值限制开始时间");
          reject();
          return;
        }
        const now = this.processTime(new Date());
        if (time.lottery_time < now) {
          this.$notify.warning("开奖时间必须晚于当前时间");
          return;
        }
        resolve(time);
      });
    },

    processTime(date: Date | string) {
      return Math.floor(new Date(date).getTime() / 1000);
    },

    getTimeStatus(time: Date) {
      const cur = new Date();
      const isToday = () => {
        return (
          time.getFullYear() === cur.getFullYear() &&
          time.getMonth() === cur.getMonth() &&
          time.getDate() === cur.getDate()
        );
      };
      return time < cur && !isToday();
    },

    setEditData(data: RoomDetail) {
      const {
        recharge_start_time,
        recharge_end_time,
        start_time,
        lottery_time,
        room_name,
        room_desc,
        max_join_num,
        recharge_amount,
        is_password_room,
      } = data;

      // @ts-ignore
      this.form = reactive({
        room_name,
        room_desc,
        max_join_num,
        recharge_amount,
        recharge_start_time: new Date((recharge_start_time as number) * 1000),
        recharge_end_time: new Date((recharge_end_time as number) * 1000),
        start_time: new Date((start_time as number) * 1000),
        lottery_time: new Date((lottery_time as number) * 1000),
        room_pass: "",
      });

      this.isEdit = true;
      this.isPasswordRoom = is_password_room;
    },
  },

  props: {
    roomId: {
      type: Number,
    },
  },
});
</script>

<style lang="scss">
.create-room-dialog {
  .el-form-item__label {
    color: #fff;
  }
}
</style>

<style scoped lang="scss">
.create-room-dialog {
  background: #36363c;
  max-height: 100vh;
  overflow-y: auto;

  .title {
    color: #fff;
    font-size: 16px;
  }

  .content {
    .tip {
      width: 100%;
      text-align: center;
      color: #fc9a2b;
      font-weight: 900;
      font-size: 15px;
    }
  }

  .el-icon-close {
    color: #fff;
    font-size: 23px;
    font-weight: bold;
    cursor: pointer;
  }
}

a{
		text-decoration: none;
	}
	.input-item {
		height: 48px;
		background: rgba(255, 255, 255, 0.39);
		border: 1px solid #99A5B7;
		opacity: 1;
		border-radius: 4px;
		padding: 0 12px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
	
		input {
			outline: 0;
			height: 48px;
		}
	}
	.popupbox {
		border-radius: 8px;
		width: 780px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 40px;
			background-color: #424B58;
			color: #fff;
			border-radius: 8px 8px 0 0;
			padding-left: 24px;
			padding-right: 20px;
			flex-shrink: 0;
		}
	
		.body {
			flex: 1;
			padding: 0 10px;
			background-color: #f5f5f5;
		}
	
		.footer {
			background-color: #f5f5f5;
			border-radius: 0 0 8px 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 30px 0;
		}
	}
	
	@media screen and (max-width: 600px) { 
	        .popupbox{
	            width: 100%;
	        }
	    }
</style>
