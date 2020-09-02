import { Template } from 'meteor/templating';
import './main.html';
import { Loans, UserRole } from "../lib/collection"
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';


Template.body.onCreated(function bodyOnCreated(){
  // console.log(user.role)
	this.selectedRole = new ReactiveDict({'selectedRole':''});
}) 

Template.body.events({
  'click': function(event, instance){
    if(event.target.type == "radio")
      instance.selectedRole.set('selectedRole',event.target.value)
  },
  'click #addmodal': function(event, instance){
    instance.selectedRole.set('applyNew',true)
  }
})

Template.body.helpers({
  selectedRoles(){
    const instance = Template.instance();
    let user = UserRole.find({user: Meteor.user().emails[0].address}).fetch()
    if(user.length != 0 || user[0].role){
      return user[0].role
    }else{
      return instance.selectedRole.get('selectedRole')
    }
  },
  applyNew(){
    const instance = Template.instance();
    return instance.selectedRole.get("applyNew")
  }
})

Template.loantable.helpers({
  loan(){
    return Loans.find({user: Meteor.user().emails[0].address}).fetch()
  }
})

Template.applyloan.events({
    'submit .add-form': function(event){
      console.log("1223")
      console.log(event.target)
      if (event.target[0].value  && event.target[1].value){
        Loans.insert({
          name: event.target[0].value,
          amount: event.target[1].value,
          user: Meteor.user().emails[0].address,
          createdAt: new Date()
        })
        Template.body.helpers({"applyNew": false})
        return true
      }else{
        return false
      }
   },
  
})

Template.roles.onCreated(function bodyOnCreated(){
	this.options = new ReactiveDict({'selectedRole':'admin'});
}) 

Template.roles.helpers({
  selectedRole(){
    const instance = Template.instance();
    return instance.options.get('selectedRole')
  }
})

Template.roles.events({
  'change .role-form': function(event, instance){
    instance.options.set('selectedRole', event.target.value)
    // insert in db
    UserRole.insert({
      "user":Meteor.user().emails[0].address,
      "role": event.target.value
    })
  }
})
