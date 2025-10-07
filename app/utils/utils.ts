/*
* 作者：李健
* 邮箱：lj2690@163.com
* */

export function debounce(fun: () => void, timer: number = 100) {
    let tag: number | null = null;
    return () => {
        if (tag !== null) {
            clearTimeout(tag);
        }
        tag = setTimeout(() => {
            fun();
        }, timer);
    };
}

class Utils {

    static isMobile() {
        // 匹配常见的移动设备用户代理模式
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileRegex = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        return mobileRegex.test(userAgent);
    }

    static getStartChar(str: string) {
        if (str && str !== '') {
            return str.charAt(0);
        }
        return '';
    }

    static RemoveLastStr(str: string, suffix: string) {
        if (!str || suffix.length !== 2) return str;
        if (str.endsWith(suffix)) {
            // 只删除最后这两个字符
            return str.slice(0, -suffix.length);
        }

        // 如果结尾不匹配，返回原字符串
        return str;
    }

    static getCssVar(varName: string, element: Element = document.documentElement) {
        if (varName.startsWith('--')) {
            return getComputedStyle(element).getPropertyValue(varName).trim();
        }
        return '';
    }


    /**
     * 根据出生日期计算年龄（支持多种日期格式，处理闰年、生日未过等边界）
     * @param birth 出生日期：支持 Date 对象、ISO字符串（如'1998-03-15'）、年月日数组（如[1998,3,15]）
     * @returns 计算出的年龄（参数无效时返回 null）
     */
    static calculateAge(birth: Date | string | [number, number, number]): number | null {
        // 1. 统一转换为 Date 对象，处理不同输入格式
        let birthDate: Date;
        if (birth instanceof Date) {
            birthDate = birth;
        } else if (typeof birth === 'string') {
            // 处理 ISO 字符串（如'1998-03-15'），避免浏览器时区差异
            const dateParts = birth.split('-').map(Number);
            if (dateParts.length !== 3 || isNaN(dateParts[0]!) || isNaN(dateParts[1]!) || isNaN(dateParts[2]!)) {
                console.error('日期字符串格式错误，需符合 "YYYY-MM-DD"');
                return null;
            }
            // 手动构造 Date（月份从 0 开始，需减 1）
            birthDate = new Date(dateParts[0]!, dateParts[1]! - 1, dateParts[2]);
        } else if (Array.isArray(birth) && birth.length === 3) {
            // 处理年月日数组（如[1998, 3, 15]）
            const [year, month, day] = birth;
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                console.error('日期数组需包含有效数字：[年, 月, 日]');
                return null;
            }
            birthDate = new Date(year, month - 1, day);
        } else {
            console.error('不支持的日期格式，请传入 Date 对象、"YYYY-MM-DD" 字符串或 [年,月,日] 数组');
            return null;
        }

        // 2. 校验日期有效性（避免无效日期如 '2024-02-30'）
        if (isNaN(birthDate.getTime())) {
            console.error('传入的出生日期无效（如不存在的日期）');
            return null;
        }

        // 3. 计算年龄（核心逻辑：对比当前日期与生日）
        const today = new Date(); // 当前日期
        let age = today.getFullYear() - birthDate.getFullYear(); // 初始年龄（年份差）
        const birthMonth = birthDate.getMonth(); // 出生月份（0-11）
        const birthDay = birthDate.getDate(); // 出生日（1-31）
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();

        // 4. 处理“今年生日未过”的情况（年龄减 1）
        if (
            todayMonth < birthMonth || // 当前月份 < 出生月份 → 生日未过
            (todayMonth === birthMonth && todayDay < birthDay) // 同月但当前日 < 出生日 → 生日未过
        ) {
            age--;
        }

        // 5. 避免年龄为负数（如出生日期在未来）
        return age < 0 ? 0 : age;
    }


    /**
     * 使用URLSearchParams API
     * @returns 解析后的参数对象
     */
    static getUrlParamsUsingAPI(): Record<string, string> {
        const params: Record<string, string> = {};
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

}

export {
    Utils
}