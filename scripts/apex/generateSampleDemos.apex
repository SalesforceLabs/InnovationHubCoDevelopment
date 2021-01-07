// Generate some sample innohub__Demo__c records

List<innohub__Demo__c> demos = new List<innohub__Demo__c>();

for(integer i = 0; i< 15; i++){
  innohub__Demo__c demo = new innohub__Demo__c();
  demo.Name = 'Insightful Demo ' + i;
  demo.innohub__Overview__c = 'Tell show tell is the way to go.';
  demo.innohub__Description__c = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  demo.innohub__Category__c = 'Value 2;Value 4';
  demo.innohub__Clouds_Involved__c = 'Value 2';
  demo.innohub__Demo_Type__c = 'Type 1';
  demos.add(demo);
}

insert demos;