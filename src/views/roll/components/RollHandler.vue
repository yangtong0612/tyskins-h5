<template>
  <v-row class="roll-handler align-center" no-gutters>
    <v-col cols="12" md="6">
      <div class="d-flex justify-md-start">
        <div v-for="item in checkbox" :key="item.title" :class="{ active: item.title === currentTitle }"
          class="checkbox-item" @click="handleClick(item)">
          {{ item.title }}
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <v-row class="d-flex align-center justify-center justify-md-end pr-2" dense>
        <!-- <v-col cols="auto">
          <el-checkbox v-model="form.no_password_room" @change="onChange"
            >非密码房</el-checkbox
          >
        </v-col> -->

        <!-- <v-col cols="6" sm="5" class="d-flex input-wrapper">
          <el-input
            size="small"
            placeholder="输入房间号或名称"
            v-model="form.keyword"
          >
            <template #append>
              <el-button size="mini" @click="onSearch">搜索</el-button>
            </template>
          </el-input>
        </v-col> -->

        <v-col cols="auto">
          <!-- <v-btn width="72" height="24" @click="handleCreate" color="primary" elevation="0" class="text-white m-v-btn"
            v-if="isAnchor">创建房间</v-btn> -->
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { IUser, useStore } from "@/store";
import { computed, defineComponent, ref, reactive } from "vue";

interface CheckboxItem {
  title: string;
  query: {
    is_join: boolean;
  };
}

export default defineComponent({
  setup() {
    const store = useStore();
    const userInfo = computed<IUser>(() => store.getters.userInfo);
    const isAnchor = computed(
      () => userInfo.value && userInfo.value.role === "anchor"
    );

    return {
      userInfo,
      currentTitle: ref("进行中"),
      form: reactive({
        room_no: "",
        is_join: false,
        no_password_room: false,
        keyword: "",
      }),
      isAnchor,
      checkbox: computed(() => {
        const checkbox = [
          {
            title: "进行中",
            query: {
              is_join: false,
              is_created: false,
              lottery_status: 0,
            },
          },
          {
            title: "我加入的",
            query: {
              is_join: true,
              is_created: false,
              lottery_status: -1,
            },
          },
          {
            title: "已结束",
            query: {
              is_join: false,
              is_created: false,
              lottery_status: 1,
            },
          },
        ];
        if (isAnchor) {
          checkbox.splice(1, 0, {
            title: "我创建的",
            query: {
              is_join: false,
              is_created: true,
              lottery_status: -1,
            },
          });
        }
        return checkbox;
      }),
    };
  },

  methods: {
    handleClick(item: CheckboxItem) {
      if (this.currentTitle === item.title) {
        return;
      }
      this.currentTitle = item.title;
      this.onChange();
    },

    onChange() {
      this.$emit("fetch");
    },

    getData() {
      console.log("GetData");
      const { is_join, is_created, lottery_status } = this.checkbox.find(
        (item) => item.title === this.currentTitle
      )!.query;

      // 别的条件不传token
      const token = is_join || is_created ? "" : "none";

      // 没有填写房间号的话删除此字段
      const form = Object.assign({}, this.form);
      if (!form.room_no) {
        // @ts-ignore
        delete form.room_no;
      } else {
        const roomNumber = Number(form.room_no);
        if (isNaN(roomNumber)) {
          this.$notify.warning("房间号只能是数字");
          throw new Error("房间号只能是数字");
        }
        // @ts-ignore
        form.room_no = roomNumber;
      }

      return {
        formData: {
          ...form,
          is_join,
          i_created: is_created,
          lottery_status,
        },
        token,
      };
    },

    onSearch() {
      console.log("on search");
      this.$emit("search");
    },

    handleCreate() {
      this.$emit("create");
    },
  },
});
</script>

<style lang="scss">
.el-checkbox__label {
  color: rgb(231, 231, 231);
}
</style>

<style scoped lang="scss">
.roll-handler {
  position: relative;
  padding: 0px 0;
  background-color: #11151b;
  height: 58px;
  margin-top: 20px;
  padding: 0 16px;
  border-radius: 10px;

  &::after {
    position: absolute;
    content: "";
    left: 16px;
    right: 16px;
    height: 2px;
    background-color: #292931;
    bottom:11px;
  }
}

.checkbox-item {
  position: relative;
  color: #84848d;
  font-size: 15px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2.6rem;
  padding: 0 20px;
  cursor: pointer;
  font-size: 14px;
  padding-bottom: 12px;
  ;

  &::last-child {
    margin-right: 0;
  }

  &.active {
    color: #e69d5c;
  }

  &.active::before {
    content: "";
    position: absolute;
    bottom: 11px;
    left: 0px;

    right: 0;

    height: 3px;
    z-index: 9;
    background-color: #e69d5c;
  }
}

@media screen and(max-width: 900px) {
  .checkbox-item {
    font-size: 13px;
    margin-right: 10px;
  }

  .m-justify-center {}
}

@media screen and (max-width: 600px) {
  .roll-handler{
    padding-left: 0px;
    padding-right: 0px;
    margin-top: 15px;
  }
  .checkbox-item{
    flex: 1;
  }
  .m-v-btn {
    position: absolute;
    right: 0;
    top: 13px;
  }
}
</style>
