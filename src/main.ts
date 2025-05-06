import express, {Request,Response,NextFunction} from "express"

const PORT:number = Number(process.env.PORT || 3000)
const HOST:string = "localhost"
const PROTOCOL:string = "http"
const app = express()

app.get("/",(req:Request, res:Response, next:NextFunction) => {
    res.json({msg:"Hello"})
})

app.listen(PORT,HOST,() => {
    console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`)
})