export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {


};

export const getPrice = (value: number | null): string => {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}