myapp.service('fetchTicket', [function() {
     var self = this;
     var ticket =undefined;

     self.setTicket = (arg) => { // to set the query data in variable while transferring from one state to another
          ticket = arg;
     }

     self.getTicket = () => { // to get the query data from the service variable after succeful transition from one state to another
          return ticket;
     }
}]);
