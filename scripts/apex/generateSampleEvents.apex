// Generate some sample innohub__Event__c records

List<innohub__Event__c> events = new List<innohub__Event__c>();

for(integer i = 0; i< 15; i++){
  innohub__Event__c event = new innohub__Event__c();
  event.Name = 'Once in a lifetime event';
  event.innohub__Active__c = true;
  event.innohub__Type__c = 'Type 2';
  event.innohub__Description__c = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  event.innohub__Agenda__c = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  event.innohub__Location__c = 'Location 2';
  event.innohub__Venue__c = 'Concert Hall';
  event.innohub__Speaker__c = 'Elon Musk';
  event.innohub__Contact__c = 'Bernd das Brot';
  event.innohub__Start__c = System.now();
  event.innohub__End__c = System.now().addHours(4);
  event.innohub__Total_Spaces_Available__c = 50;
  events.add(event);
}

insert events;