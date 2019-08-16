import Vuex from 'vuex'

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'

import Piece from '@/components/Piece.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Piece.vue', () => {

  var propsData, getters, actions, store;

  // establish spies for testing action calls
  // because Vue wraps actions, the actual action methods will not be directly accessible,
  // so we must create dummy methods that we can later access to act as our spy for action to wrap around
  var spies = {
    setSelectedPiece: sinon.spy()
  }

  // called before each it
  beforeEach(() => {
    // set up initial state, getters, setters
    propsData = {
      r: 0,
      c: 0,
      pieceType: 6,
      pieceCharacter: '車',
      isTutorial: false
    };

    actions = {
      // make actions wrap around our dummy method
      setSelectedPiece: spies.setSelectedPiece
    };
    getters = {
      currentTurn: () => 0,
      playerColor: () => 0,
      selectedPiece: () => {
        return {
          row: -1,
          col: -1
        }
      }
    };
  });

  // clear history of all spies
  afterEach(() => {
    for (let spy in spies) {
      if (spies.hasOwnProperty(spy)) {
        spies[spy].resetHistory();
      }
    }
  })

  // test that piece correctly displays the character that represents this piece
  it('displays piece character on piece', () => {
    store = new Vuex.Store({
      getters,
      actions
    })
    const wrapper = shallowMount(Piece, {
      propsData,
      store,
      localVue
    });

    // expect inner text of <text> tag to equal pieceCharacter prop
    const expectedDisplayCharacter = wrapper.vm.$props.pieceCharacter;
    const actualDisplayCharacter = wrapper.find('.piece__character').text();
    expect(actualDisplayCharacter).to.equal(expectedDisplayCharacter);
  })

  // test that a piece will trigger select call if clicked on, meeting following conditions
  // 1. piece color matches player color
  // 2. current turn matches player color
  // i.e. player can select own piece during own turn
  it('sets selected piece if clicking own piece during own turn', () => {
    store = new Vuex.Store({
      getters,
      actions
    })
    const wrapper = shallowMount(Piece, {
      propsData,
      store,
      localVue
    });
    // simulate a click on the piece
    wrapper.trigger('click');
    expect(spies.setSelectedPiece).to.have.been.calledWith();
  })

  // test that a piece will NOT trigger select call if clicked on, failing following conditions
  // 1. piece color matches player color
  // i.e. player can't select opponent's piece
  it('does not set selected piece if clicking opponent piece during own turn', () => {
    // overwrite default getter for playerColor
    getters.playerColor = () => 1;
    store = new Vuex.Store({
      getters,
      actions
    })
    const wrapper = shallowMount(Piece, {
      propsData,
      store,
      localVue
    });
    // simulate a click on the piece
    wrapper.trigger('click');
    expect(spies.setSelectedPiece).to.not.have.been.calledWith();
  })

  // test that a piece will NOT trigger select call if clicked on, failing following conditions
  // 1. piece color matches player color
  // i.e. player can't select opponent's piece
  it('does not set selected piece if clicking own piece during opponent turn', () => {
    // overwrite default getter for currentTurn
    getters.currentTurn = () => 1;
    store = new Vuex.Store({
      getters,
      actions
    })
    const wrapper = shallowMount(Piece, {
      propsData,
      store,
      localVue
    });
    // simulate a click on the piece
    wrapper.trigger('click');
    expect(spies.setSelectedPiece).to.not.have.been.calledWith();
  })
})