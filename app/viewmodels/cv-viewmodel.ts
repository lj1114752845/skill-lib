/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {type ApplicantModel} from "~/models/resume/applicant-model";
import {CvRepository} from "~/repositorys/cv-repository";

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
    private repository: CvRepository

    constructor(data: CvData) {
        this.data = data;
        this.repository = new CvRepository();
    }


    async getResumer() {
        this.data.err = '';
        const res = await this.repository.getCv();
        if (res.code === 1) {
            this.data.applicantData = res.data as ApplicantModel;
        } else {
            this.data.err = res.message;
        }
    }
}

export {
    CvViewModel,
    CvData
}