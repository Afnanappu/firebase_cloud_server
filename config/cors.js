import cors from "cors"

const corsOptions = {
    origin: "*", // Allow all domains
    methods: ["GET", "POST"], // Allow only GET and POST methods
};

export default cors(corsOptions)