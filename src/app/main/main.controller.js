(function() {
  'use strict';

  angular
    .module('expenses')

    .constant('appSettings', {
      db: 'http://127.0.0.1:5984/expenses'
    })

    .controller('MainController', function($http, $scope, appSettings) {
    var vm = this;
    vm.items;
    vm.status;

    vm.welcome = "Main Controller";

    console.log(appSettings);

    function getItems () {
      $http.get(appSettings.db + '/_design/expenses/_view/byName')
      .success(function (data) {
        console.log(data);
        vm.items = data.rows;
      });
    }
    getItems();

    vm.processForm = function () {
      var item = {
        name: vm.name,
        price: vm.price
      };
      console.log(item)
      postItem(item);
    };

    function postItem (item) {
    // optimistic ui update
      vm.items.push({key: vm.name, value: vm.price});
    // send post request
      $http.post(appSettings.db, item)
        .success(function () {
          vm.status = '';
        }).error(function (res) {
          vm.status = 'Error: ' + res.reason;
          // refetch items from server
          getItems();
      });
    } 
    
  });  
})();
