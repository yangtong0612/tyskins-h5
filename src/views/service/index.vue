<template>
  <div class="service-wrap mt-3">
	  <div class="service">
	      <div class="mt-6">
	        <h2 class="text-center">{{ title }}</h2>
	        <pre>{{ content }}</pre>
	      </div>
	    </div>
	
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, reactive, computed, ref } from "vue";
import { useRoute } from "vue-router";
import serviceContent from "./content";

export default defineComponent({
  setup() {
    const route = useRoute();	

    const getContent = () => {
      let type = Number(route.query.type) || 1;
      type--;
      return {
        title: serviceContent[type].title || "",
        content: serviceContent[type].content || "内容整理中",
      };
    };

    const content = computed(() => getContent());

		return {
      title: computed(() => content.value.title),
      content: computed(() => content.value.content),
		}
  },
});
</script>

<style scoped lang="scss">
.service {
  padding-top: 20px;
  font-size: 14px;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #11151b;
  color: #ffffff;
  padding-bottom: 30px;
  min-height: 1000px;
}

pre {
  box-sizing: border-box;
  word-break: break-all;
  white-space: pre-line;
  font-size: 14px;
  color: #ffffff;
  padding: 0 30px;
  line-height: 26px;
}
</style>
