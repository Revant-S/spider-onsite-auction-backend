type Task = () => Promise<void>;

class MailQue {
    private tasks: Task[] = [];
    private isProcessing = false;

    public addTask(task: Task) {
        this.tasks.push(task);
        this.processQueue();
    }

    private async processQueue() {
        if (this.isProcessing) return;

        this.isProcessing = true;

        while (this.tasks.length > 0) {
            const task = this.tasks.shift();
            if (task) {
                try {
                    await task();
                } catch (error) {
                    console.error('Error processing task:', error);
                }
            }
        }

        this.isProcessing = false;
    }
}

const notificationQueue = new MailQue();
export default notificationQueue;
