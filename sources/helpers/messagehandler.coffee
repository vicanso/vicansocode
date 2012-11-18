config = require '../config'
_ = require 'underscore'
isMaster = config.isMaster()
class MessageHandler
  constructor : (cluster, type = 'msg') ->
    @type = type
    if isMaster
      @msgHandlerList = _.map cluster.workers, (worker) ->
        return worker.process
    else
      @msgHandlerList = [process]
  on : (event, cbf) ->
    type = @type
    msgHandlerList = @msgHandlerList
    _.each @msgHandlerList, (msgHandler, workerId) ->
      msgHandler.on event, (m) ->
        if m.type == type
          if isMaster && m.mode == 'broadcast'
            _.each msgHandlerList, (msgHandler, index) ->
              if index != workerId
                msgHandler.send m
          cbf m.msg
  send : (msg, mode = 'broadcast') ->
    type = @type
    sendData = 
      type : @type
      msg : msg
    if !isMaster
      sendData.mode = mode
    _.each @msgHandlerList, (msgHandler) ->
      msgHandler.send sendData

module.exports = MessageHandler