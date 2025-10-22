<template>
	<q-popup width="762px" title="房间信息" ref="popupRef">
		<div class="px-8 pt-8">
			<div class="text-gray fs12 mb-4">
				<span class="text-red">*</span>Roll房功能仅限于网站活动，玩家福利发放，请勿用于私下交换饰品等风险活动，避免上当受骗。
			</div>
			<el-form ref="formComponent" label-width="120px" :model="form">
				<el-form-item label="房间名称">
					<el-input placeholder="输入房间名称" v-model="form.room_name" />
				</el-form-item>
				<el-form-item label="房间描述">
					<el-input maxlength="100" show-word-limit placeholder="输入房间描述" rows="3" v-model="form.room_desc"
						type="textarea" />
				</el-form-item>
				<v-row>
					<v-col cols="6" lg="6">
						<el-form-item label="最大参与人数">
							<el-input-number v-model="form.max_join_num" :min="1" />
						</el-form-item>
					</v-col>
					<v-col cols="6" lg="6">
						<el-form-item label="限时充值门槛">
							<el-input-number v-model="form.recharge_amount" :min="0" />
						</el-form-item>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6" lg="6">
						<el-form-item label="开始时间">
							<el-date-picker
							  :teleported = "false"
							  placeholder="请选择时间"
							  v-model="form.start_time"
							  type="datetime"
							  :disabledDate="getTimeStatus"
							></el-date-picker>
						</el-form-item>
					</v-col>
					<v-col cols="6" lg="6">
						<el-form-item label="开奖时间">
							<el-date-picker :teleported = "false" :disabledDate="getTimeStatus" v-model="form.lottery_time" type="datetime" placeholder="请选择时间" />
						</el-form-item>
					</v-col>
				</v-row>

				<v-row v-if="form.recharge_amount > 0">
					<v-col cols="6" lg="6">
						<el-form-item label-width="120" label="充值限制开始时间">
							<el-date-picker :teleported = "false" v-model="form.recharge_start_time" type="datetime" placeholder="请选择时间" />
						</el-form-item>
					</v-col>
					<v-col cols="6" lg="6">
						<el-form-item label-width="120" label="充值限制结束时间">
							<el-date-picker :teleported = "false" v-model="form.recharge_end_time" type="datetime" placeholder="请选择时间" />
						</el-form-item>
					</v-col>
				</v-row>

				<v-row>
					<v-col>
						<el-form-item label="房间类型">
							<el-select v-model="form.is_promotion" placeholder="请选择房间类型">
								<el-option label="普通房" :value="0"></el-option>
								<el-option label="推广房" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</v-col>
					<v-col>
						<el-form-item label="房间类型">
							<template #label>
								<el-checkbox v-model="usePassword" label="房间密码" />
							</template>
							<el-input v-if="usePassword" style="width: 100%;" placeholder="输入房间密码(不设置留空)"
								v-model="form.room_pass" />
						</el-form-item>
					</v-col>
				</v-row>
			</el-form>
		</div>
		<template #footer>
			<div class="py-4 pl-10">
				<v-btn @click="submit" elevation="0" width="182" height="48" color="primary">{{ isEdit ? "编辑" : "创建" }}房间</v-btn>

			</div>
		</template>
	</q-popup>
</template>

<script setup lang="ts">
	import {
		ref,
		reactive,
		toRefs
	} from 'vue';
	import {
		CreateRoomForm,
		RoomDetail
	} from "@/types/roll";
	import { RollService } from "@/services/RollService";
	import QPopup from "@/components/QPopup.vue";
	import { toast } from "@/composables/util"
	import { useRouter } from "vue-router";
	const router = useRouter();
	const popupRef = ref(null);
	const state = reactive({
		usePassword: false,
		time: {
			start_time: "",
			lottery_time: "",
			recharge_start_time: "",
			recharge_end_time: "",
		},
		form: {
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
		},
		isEdit: false,
		isCancelPassword: false,
		isPasswordRoom: false,
	})
	const {
		form,
		isEdit,
		isCancelPassword,
		isPasswordRoom,
		usePassword,
		time
	} = toRefs(state);
	
	// const rules = reactive({
	// 	room_name: new TextRule("房间名称"),
	// 	join_num: new NumberRule(10),
	// 	recharge_amount: new NumberRule(0),
	// 	max_join_num: new NumberRule(100),
	// 	start_time: new TimeRule(),
	// 	lottery_time: new TimeRule(),
	// 	recharge_start_time: new TimeRule(),
	// 	recharge_end_time: new TimeRule(),
	// });
	const formComponent = ref(null);
	const handleCreate = ()=> {
	  const form = formComponent.value;
	  form.validate((valid) => {
	    if (valid) {
	      createRoom();
	    } else {
	      toast('请按照提示填写所需内容');
	      return false;
	    }
	  });
	};
	
	const submit = ()=> {
	  checkAndProcessTime().then((res) => {
	    const {
	      start_time,
	      lottery_time,
	      recharge_start_time,
	      recharge_end_time,
	    } = res;
	    const data = Object.assign({}, state.form, {
	      start_time,
	      lottery_time,
	      recharge_start_time,
	      recharge_end_time,
	    });
	    const task = state.isEdit ? editRoom(data) : createRoom(data);
	    // task.then(() => {
	    //   this.$emit("refresh");
	    // });
	  });
	};
	const createRoom = (data) => {
	  return RollService.createRoom(data).then((res) => {
	    if (res.data.code === 0) {
	      // @ts-ignore
	      window.autoOpenPushDialog = true;
		  router.push(`/roll/${res.data.data.id}`);
	      toast('创建房间成功')
	      close();
	    }
	  });
	};
	
	const checkAndProcessTime = ()=> {
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
	    time[field] = processTime(state.form[field]);
	  }
	  if (state.form.recharge_amount === 0 && time.start_time) {
	    const now = new Date(time.start_time * 1000);
	    now.setHours(now.getHours() - 1);
	    time.recharge_end_time = processTime(now);
	    now.setHours(now.getHours() - 1);
	    time.recharge_start_time = processTime(now);
	  }
	  return new Promise((resolve, reject) => {
	    // 充值时间校验
	    if (time.recharge_end_time > time.lottery_time) {
	      console.log(time.recharge_end_time, time.lottery_time);
	     
		  toast('充值结束时间不可晚于开奖时间', 'warning')
	      reject();
	      return;
	    }
	    if (time.recharge_start_time > time.recharge_end_time) {
			 toast('充值限制结束时间不能早于充值限制开始时间', 'warning')
	      reject();
	      return;
	    }
	    const now = processTime(new Date());
	    if (time.lottery_time < now) {
		  toast('开奖时间必须晚于当前时间', 'warning')
	      return;
	    }
	    resolve(time);
	  });
	};
	
	const getTimeStatus = (time) => {
	  const cur = new Date();
	  const isToday = () => {
	    return (
	      time.getFullYear() === cur.getFullYear() &&
	      time.getMonth() === cur.getMonth() &&
	      time.getDate() === cur.getDate()
	    );
	  };
	  return time < cur && !isToday();
	};
	
	const processTime = (date) => {
	  return Math.floor(new Date(date).getTime() / 1000);
	};
	
	const setEditData = (data) => {
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
	    state.form = {
	      room_name,
	      room_desc,
	      max_join_num,
	      recharge_amount,
	      recharge_start_time: new Date((recharge_start_time as number) * 1000),
	      recharge_end_time: new Date((recharge_end_time as number) * 1000),
	      start_time: new Date((start_time as number) * 1000),
	      lottery_time: new Date((lottery_time as number) * 1000),
	      room_pass: "",
	    };
	
	    state.isEdit = true;
	    state.isPasswordRoom = is_password_room;
	};

	function open() {
		popupRef.value.open();
	}
	function close() {
		popupRef.value.close();
	}
	// 向父组件暴露以下方法
	defineExpose({
		open,
		close
	})
</script>

<style>
</style>
