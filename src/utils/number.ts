export function randomIntFromInterval(min:number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
export function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}
