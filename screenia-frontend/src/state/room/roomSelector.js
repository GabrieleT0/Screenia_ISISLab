import moment from "moment";
import { selector } from "recoil";
import { fetchCommentsByRoom, fetchDiscussionByRoom } from "../../api/opereApi";
import { roomCommentsAtom } from "./roomAtom";

export const getCommentsAndDiscussionsSelector = selector({
    key: `roomMessagesSelector`,
    get: async ({ get }) => {
        
        const roomComments = get(roomCommentsAtom);
        const idRoom = roomComments.idRoom;
        const filter = roomComments.filter;
        if(!idRoom) {
            return [];
        }

        try {
            const responseComments = await fetchCommentsByRoom(idRoom);
            const responseDiscussions = await fetchDiscussionByRoom(idRoom);

            let discussionMessages = [];

            if(filter === 'history') {
                discussionMessages = responseComments.data.sort((a,b) => {  
                    return moment(a.insert_date).isAfter(moment(b.insert_date)) ? 1 : -1;  
                })
            } else if(filter === 'both') {
                const bothMessages = [...responseComments.data, ...responseDiscussions.data];
                discussionMessages = bothMessages.sort((a,b) => {
                    const dateA = moment(a.insert_date);
                    const dateB = moment(b.insert_date);
                    return dateA.isAfter(dateB) ? 1 : -1;  
                })
            } else if(filter === 'discussion') {
                discussionMessages = responseDiscussions.data.sort((a,b) => {  
                    return moment(a.insert_date).isAfter(moment(b.insert_date)) ? 1 : -1;  
                })
            }
            
            return discussionMessages;
        } catch(error) {
            
            throw error;
        }
    },
});
  