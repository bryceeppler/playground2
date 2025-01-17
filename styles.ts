export const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background-color: #f5f6fa;
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #2d3436;
    }

    .container {
        width: 95%;
        max-width: 1600px;
        margin: 20px auto;
        padding: 20px;
    }

    .dashboard-title {
        text-align: center;
        color: #2d3436;
        margin: 20px 0 40px;
        font-size: 28px;
        font-weight: 600;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
        max-width: 1400px;
        margin: 0 auto;
    }

    .chart-container {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .chart-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .chart-container.full-width {
        grid-column: 1 / -1;
        max-width: 1400px;
        margin: 0 auto;
    }

    .section-title {
        color: #636e72;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: 500;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .chart-wrapper {
        width: 100%;
        height: 400px;
        position: relative;
        flex-grow: 1;
    }

    .chart-wrapper.full-width {
        min-height: 500px;
    }

    @media (max-width: 1200px) {
        .charts-grid {
            grid-template-columns: 1fr;
        }
    }
`; 