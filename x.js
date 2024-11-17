// Post /api/returns {customerId, MovieId}

//Return 401 if client is not logged it
//Return 400 if customer id is not provided
//Return 400 if Movie id is not provided
//Return 404 if no rental found for this customer/movie
//Return 400 if rental already processed
//Return 200 if valid request
//Set the return data
//Calculate the rental fee
//Increase the stock
//Return the rental