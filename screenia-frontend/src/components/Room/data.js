const discussions = [
    {
        "id": 1,
        "insert_date": "2023-01-30T16:47:38.000Z",
        "text": `{"blocks":[{"key":"6551c","text":"Prova discussione","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        "flat_text": "Prova",
        "user_id": 5,
        "room_id": 1,
        "user": {
            "id": 5,
            "name": "Gerardo",
            "surname": "Donnarumma",
            "email": "gerardodonnarumma99@gmail.com"
        }
    },
    {
        "id": 1,
        "insert_date": "2023-02-01T16:47:38.000Z",
        "text": `{"blocks":[{"key":"6551c","text":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        "flat_text": "Prova",
        "user_id": 5,
        "room_id": 1,
        "user": {
            "id": 5,
            "name": "Gerardo",
            "surname": "Donnarumma",
            "email": "gerardodonnarumma99@gmail.com"
        }
    }
];

const comments = [
    {
        "id": 1,
        "text": "{\"blocks\":[{\"key\":\"6551c\",\"text\":\"Prova commento 1\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
        "flat_text": "Prova commento 1",
        "update_date": "2023-01-25T10:23:47.000Z",
        "from_paragraph": 1,
        "to_paragraph": 2,
        "tag_update": "minor",
        "tags": [],
        "id_parent_comment": 129,
        "user": {
            "id": 5,
            "email": "gerardodonnarumma99@gmail.com",
            "name": "Gerardo",
            "surname": "Donnarumma"
        }
    },
    {
        "id": 1,
        "text": "{\"blocks\":[{\"key\":\"6551c\",\"text\":\"Prova commento 2\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
        "flat_text": "Prova commento 2",
        "update_date": "2023-01-26T10:23:47.000Z",
        "from_paragraph": 1,
        "to_paragraph": 2,
        "tag_update": "minor",
        "tags": [],
        "id_parent_comment": 129,
        "user": {
            "id": 5,
            "email": "gerardodonnarumma99@gmail.com",
            "name": "Gerardo",
            "surname": "Donnarumma"
        }
    },
    {
        "id": 1,
        "text": "{\"blocks\":[{\"key\":\"6551c\",\"text\":\"Prova commento 3\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
        "flat_text": "Prova commento 3",
        "update_date": "2023-01-27T15:27:24.000Z",
        "from_paragraph": 1,
        "to_paragraph": 2,
        "tag_update": "major",
        "tags": ["test1", "test2", "test3"],
        "id_parent_comment": 129,
        "user": {
            "id": 5,
            "email": "gerardodonnarumma99@gmail.com",
            "name": "Gerardo",
            "surname": "Donnarumma"
        }
    }
];

export {
    discussions,
    comments
}