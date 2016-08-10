// spec for testing page model in /models/index.js
var models = require('../models');
var Page = models.Page;
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.should();
chai.use(spies);
chai.use(require('chai-things'));



describe('Page model', function () {


  // beforeEach('Creates page instance', function (done) {
  //   Page.create(samplePage)
  //   .then(function(content){
  //     console.log('we get to here!');
  //     page = content;
  //     console.log(content);
  //     done();
  //   })
  //   .catch(done);
  // })

  describe('Virtuals', function () {
    describe('route', function () {
      var page;
      var samplePage;

      samplePage = {
        title: 'Test',
        content: 'random',
        // status: 'on',
        tags: ['sup', 'bye']
      }

      beforeEach('Sync tables', function(done){
        Page.sync({force:true})
        .then(function(){
          done();
        })
        .catch(done);
      });

      beforeEach('Creates page instance', function(done){
        page = Page.build(samplePage); // builds page, but does NOT save it
        done(); // tells Mocha that you are running asynchronous test, only runs result check after
      })

      it('returns the url_name prepended by "/wiki/"', function(){
          page.urlTitle = 'Java_script';
          expect(page.route).to.be.equal("/wiki/" + page.urlTitle);
      })

    });
    describe('renderedContent', function () {
      var page;
      var samplePage;

      samplePage = {
        title: 'Test',
        content: 'random',
        // status: 'on',
        tags: ['sup', 'bye']
      }

      beforeEach('Sync tables', function(done){
        Page.sync({force:true})
        .then(function(){
          done();
        })
        .catch(done);
      });

      beforeEach('Creates page instance', function(done){
        page = Page.build(samplePage); // builds page, but does NOT save it
        done(); // tells Mocha that you are running asynchronous test, only runs result check after
      })

      it('converts the markdown-formatted content into HTML', function(){
          page.content = '### Javascript';
          expect(page.renderedContent).to.be.equal("<h3 id=\"javascript\">Javascript</h3>\n");
      });
    });
  });

  describe('Class methods', function () {
    describe('findByTag', function () {

      beforeEach('Sync tables', function(done){
        Page.sync({force:true})
        .then(function(){
          done();
        })
        .catch(done);
      });

      beforeEach(function (done) {
        Page.create({
          title: 'foo',
          content: 'bar',
          tags: ['foo', 'bar']
        })
        .then(function () {
          done();
        })
        .catch(done);
      });
      it('gets pages with the search tag', function(done){
          Page.findByTag('bar')
            .then(function(pages){
              expect(pages).to.have.lengthOf(1);
              done();
            })
            .catch(done);
      });
      it('does not get pages without the search tag', function(done){
        Page.findByTag('Dan')
          .then(function(pages){
            expect(pages).to.have.lengthOf(0);
            done();
          })
          .catch(done);
      });
    });
  });


  describe('Instance methods', function () {
    describe('findSimilar', function () {
      var testPage;
      var similars;
      // var page1, page2, page3;
      // var objGroup = {
      //   obj1: {title: 'foo', content: 'bar', tags: ['foo', 'bar']},
      //   obj2: {title: 'baby', content: 'bart', tags: ['bar', 'foot']},
      //   obj3: {title: 'dan', content: 'mandel', tags: ['full', 'stack']}
      // }


      beforeEach('Sync tables', function(done){
        Page.sync({force:true})
        .then(function(){
          done();
        })
        .catch(done);
      });

      beforeEach('make 3 pages', function(done){
        Page.bulkCreate([
          {title: 'foo', content: 'bar', tags: ['foo', 'bar']},
          {title: 'baby', content: 'bart', tags: ['bar', 'foot']},
          {title: 'dan', content: 'mandel', tags: ['full', 'stack']}])
            .then(function(){
              console.log("We're done");
              done();
            })
            .catch(done);
      })

      // beforeEach('Creates Page 1', function (done){
      //   Page.create(objGroup['obj1'])
      //     .then(function(){
      //       done();
      //     })
      //     .catch(done);
      // })
      // beforeEach('Creates Page 2', function (done){
      //   Page.create(objGroup['obj2'])
      //     .then(function(){
      //       done();
      //     })
      //     .catch(done);
      // })
      // beforeEach('Creates Page 3', function (done){
      //   Page.create(objGroup['obj3'])
      //     .then(function(){
      //       done();
      //     })
      //     .catch(done);
      // })

      beforeEach(function (done){
        Page.findOne({
          where: {
            title: 'foo'
          }
        })
          .then(function (page){
            testPage = page;
            done();
          })
          .catch(done);
      })

      // beforeEach(function (done){
      //   testPage.findSimilar()
      //     .then(function(similarPages){
      //       similars = similarPages
      //       done();
      //     })
      // })

      it('never gets itself', function(done){
          testPage.findSimilar()
          .then(function(similarPages){
            similarPages.should.not.include(testPage);
            done();
          })
      });
      it('gets other pages with any common tags', function(done){
        testPage.findSimilar()
          .then(function(similarPages){
            similarPages.should.include
          })
      });
      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating');
  });

});

