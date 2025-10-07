<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import {CvData, CvViewModel} from "~/viewmodels/cv-viewmodel";
import {reactive} from "vue";
import ApplicantView from "~/pages/cv/child/ApplicantView.vue";
import ItemTitleView from "~/pages/cv/child/ItemTitleView.vue";
import JobIntentionView from "~/pages/cv/child/JobIntentionView.vue";
import SelfEvaluationView from "~/pages/cv/child/SelfEvaluationView.vue";
import WorkExperienceView from "~/pages/cv/child/WorkExperienceView.vue";
import ProjectExperienceView from "~/pages/cv/child/ProjectExperienceView.vue";
import EducationalExperienceView from "~/pages/cv/child/EducationalExperienceView.vue";
import ProfessionalSkillsView from "~/pages/cv/child/ProfessionalSkillsView.vue";
import RadarChart from "~/pages/cv/child/radar-chart.vue";

useHead({
  title: '李健强的简历',
  meta: [
    {name: 'description', content: '李健强的简历介绍页'}
  ],
})

const data: CvData = reactive(new CvData());
const option = ref({});

const vm = new CvViewModel(data);

init();

function init() {
  vm.getResumer();
}

watch(() => data.applicantData, () => {
  if (!data.applicantData) {
    return;
  }
  let skills = data.applicantData.skills;
  let xAxisData = [];
  let seriesData = [];
  for (let skill of skills) {
    xAxisData.push(skill.name);
    seriesData.push(skill.often);
  }
  option.value = createRadarOption(skills.map((item) => {
    return {name: item.name, max: 90};
  }), skills.map(item => item.often));
});

function createRadarOption(indicator: Record<string, any>[], value: number[]) {
  return {
    title: {
      text: '技能雷达图'
    },
    radar: {
      indicator: indicator
    },
    grid: {
      alignTicks: false
    },
    series: [
      {
        name: '技能',
        type: 'radar',
        data: [
          {
            value: value,
          }
        ]
      }
    ]
  };
}
</script>

<template>
  <div class="cv-container">
    <el-scrollbar v-if="data.applicantData" height="100%">
      <div class="cv-box">
        <ApplicantView :data="data.applicantData"></ApplicantView>
        <ItemTitleView title-name="专业技能"></ItemTitleView>
        <ProfessionalSkillsView :data="data.applicantData.skills"></ProfessionalSkillsView>
        <RadarChart :option="option" style="align-self: center"></RadarChart>
        <ItemTitleView title-name="求职意向"></ItemTitleView>
        <JobIntentionView :data="data.applicantData.jobIntentionModels"></JobIntentionView>
        <ItemTitleView title-name="自我评价"></ItemTitleView>
        <SelfEvaluationView :data="data.applicantData.selfEval"></SelfEvaluationView>
        <ItemTitleView title-name="工作经历"></ItemTitleView>
        <WorkExperienceView :data="data.applicantData.workExpModels"></WorkExperienceView>
        <ItemTitleView title-name="项目经历"></ItemTitleView>
        <ProjectExperienceView :data="data.applicantData.projectInfoModels"></ProjectExperienceView>
        <ItemTitleView title-name="教育经历"></ItemTitleView>
        <EducationalExperienceView :data="data.applicantData.educations"></EducationalExperienceView>
      </div>
    </el-scrollbar>
    <div v-else>
      <el-empty :description="data.err === '' ? '空数据':data.err"/>
    </div>
  </div>
</template>
<style scoped>

.cv-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 960px;
}

.cv-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>