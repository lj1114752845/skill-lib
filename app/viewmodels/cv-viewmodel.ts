/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {type ApplicantModel} from "~/models/resume/applicant-model";

class CvData {
    applicantData?: ApplicantModel
    err: string


    constructor(applicantData?: ApplicantModel, err?: string) {
        this.applicantData = applicantData;
        this.err = err ?? '';
    }
}

class CvViewModel {
    private data: CvData;

    constructor(data: CvData) {
        this.data = data;
    }


    async getResumer() {
        this.data.err = '';
        const data = await fetch('/ljq.json');
        if (data.ok) {
            this.data.applicantData = await data.json();
        } else {
            this.data.err = '找不到文件';
        }
    }
}

export {
    CvViewModel,
    CvData
}