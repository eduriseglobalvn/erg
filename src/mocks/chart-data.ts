// src/constants/chart-data.ts
export const generateChartData = () => {
    const data = [];
    const today = new Date();
    // Tạo data cho 100 ngày để dư dả
    for (let i = 100; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const desktop = Math.floor(Math.random() * 300) + 100 + Math.sin(i / 5) * 50;
        const mobile = Math.floor(Math.random() * 200) + 80 + Math.cos(i / 5) * 30;

        data.push({
            date: date.toISOString().split('T')[0],
            desktop: Math.floor(desktop),
            mobile: Math.floor(mobile),
        });
    }
    return data;
};

export const VISITORS_DATA = generateChartData();