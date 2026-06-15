auth Router
    - POST - Sign up
    - POST - Login
    - POST - Logout

profileRouter
    - GET - /profile/view
    - PATCH - /profile/edit
    - PATCH - /profile/password

connectionsRequestRouter   
    - POST - /request/send/interseted/:userID  = Tinder Swipe right
    - POST - /request/send/ignored/:userID = Tinder Swipe left
    for above we can make dynamic api's
    /request/send/:status/:userID 

    - POST - /request/review/accepted/:requestID = Tinder profile Accepted
    - POST - /request/review/rejected/:requestID = Tinder profile Rejected
    for above we can make dynamic api's
        /request/review/:status/:requestId 
User Router
    - GET - /user/connections = accepted connections 
    - GET - /user/pending/request  - pending connection request
    - GET - /user/feed 
