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

User Router
    - GET - /user/connections = Tinder connections 
    - GET - /user/request  = Tinder profile connections
    - GET - /user/feed 
