import { Message } from "@/model/User.model";
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingResponses? : boolean;
    messages? : Array<Message>;
}
