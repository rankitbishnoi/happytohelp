myapp.service('fetchTicket', [function() {
     var self = this;
     var ticket =undefined;

     self.setTicket = (arg) => {
          ticket = arg;
     }

     self.getTicket = () => {
          return ticket;
     }
}]);
