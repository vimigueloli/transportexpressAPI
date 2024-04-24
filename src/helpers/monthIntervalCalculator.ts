import moment from "moment"

export default function monthIntervalCalculator(month:number|undefined, year:number|undefined){
    let start 

    if(month){
        start = `${year? year :new Date().getFullYear()}/${month<10? "0":''}${month}/01`
    }else{
        start = `${year? year :new Date().getFullYear()}/${(new Date().getMonth()+1)<10?'0':''}${new Date().getMonth()+1}/01`
    }
    let end = moment(new Date(start)).endOf('month').format('YYYY-MM-DD')

    return({
        start: new Date(start),
        end: new Date(end)
    })
}