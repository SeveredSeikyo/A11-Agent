export const postToSlack = async (text: string) => {
    const url = process.env.SLACK_WEBHOOK_URL!;
    
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        if(!response.ok) throw new Error;

        return "Posted to Slack!"

    } catch (error){
        console.log("Error occurred.")
    }
};

export const buildSummary = (state: any): string => {
    // Build a summary message from the state results
    const results = state.results || {};
    let summary = "Agent Execution Summary:\n";
    for (const [key, value] of Object.entries(results)) {
        summary += `${key}: ${JSON.stringify(value)}\n`;
    }
    return summary.trim();
};