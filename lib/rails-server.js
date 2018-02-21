'use babel';

import RailsServerView from './rails-server-view';
import { CompositeDisposable } from 'atom';
const { exec } = require('child_process');

export default {

  railsServerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.railsServerView = new RailsServerView(state.railsServerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.railsServerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rails-server:restart': () => this.restart()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.railsServerView.destroy();
  },

  serialize() {
    return {
      railsServerViewState: this.railsServerView.serialize()
    };
  },
  restart() {
    filePath = atom.workspace.getActivePaneItem().buffer.file.path;
    let projectPath = "";
    atom.project.getDirectories().forEach(function(dir){
    	if (dir.contains(filePath)) {
    		projectPath = dir.path;
    	}
    });

    exec('rails restart', { cwd: projectPath },(error, stdout, stderr) => {
      atom.notifications.addInfo('Restarting Rails Server');
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
  }

};
