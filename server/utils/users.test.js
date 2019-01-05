var expect = require('expect');

var {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Artem',
            room: '1'
        },{
            id: 2,
            name: 'Artem1',
            room: '2'
        },{
            id: 3,
            name: 'Artem2',
            room: '1'
        }]
    })

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: 1,
            name: 'Artem',
            room: '1'
        };

        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = 1;
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        var userId = 4;
        var user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        var userId = 1;
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });
    
    it('should not find user', () => {
        var userId = 4;
        var user = users.getUser(userId);

        expect(user).toBeFalsy();
    });

    it('should return users for 1', () => {
        var resUsers = users.getUserList('1');

        expect(resUsers).toEqual(['Artem', 'Artem2']);
    })

    it('should return users for 2', () => {
        var resUsers = users.getUserList('2');

        expect(resUsers).toEqual(['Artem1']);
    })

    it('should retun false for non uniq user', () => {
        var userName = 'Artem1';
        var res = users.isUserUniq(userName);

        expect(res).toBe(false);
    });

    it('should retun true for uniq user', () => {
        var userName = 'Artem3';
        var res = users.isUserUniq(userName);

        expect(res).toBe(true);
    });
});