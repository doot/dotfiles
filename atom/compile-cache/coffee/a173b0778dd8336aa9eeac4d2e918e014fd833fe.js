(function() {
  var CreateFixtures, FtpHost, Host, InterProcessData, LocalFile, RemoteFile, SftpHost, fs, temp;

  fs = require('fs-plus');

  temp = require('temp').track();

  InterProcessData = require('../lib/model/inter-process-data');

  Host = require('../lib/model/host');

  FtpHost = require('../lib/model/ftp-host');

  SftpHost = require('../lib/model/sftp-host');

  RemoteFile = require('../lib/model/remote-file');

  LocalFile = require('../lib/model/local-file');

  module.exports = CreateFixtures = (function() {
    function CreateFixtures() {
      var firstLocalFile, ftpHostNoPassword, ftpHostWithPassword, ipd, localFile1, localFile2, remoteFile1, remoteFile2, secondLocalFile, sftpHostAgent, sftpHostPassword, sftpHostPkey;
      this.persistFile = temp.openSync({
        suffix: '.json'
      }).path;
      firstLocalFile = temp.openSync({
        suffix: 'coffee'
      }).path;
      secondLocalFile = temp.openSync({
        suffix: 'bash'
      }).path;
      ftpHostNoPassword = new FtpHost("ftpHostAlias", "ftpHostNoPassword", "/", "username", "21", [], true);
      remoteFile1 = new RemoteFile("/bogus/path/1", true, false, false, "6 byte", "0755", "22:08 30/08/2014");
      remoteFile2 = new RemoteFile("/bogus/path/2", true, false, false, "6 byte", "0755", "22:08 30/08/2014");
      localFile1 = new LocalFile(firstLocalFile, remoteFile1, ftpHostNoPassword);
      localFile2 = new LocalFile(secondLocalFile, remoteFile2, ftpHostNoPassword);
      ftpHostNoPassword.addLocalFile(localFile1);
      ftpHostNoPassword.addLocalFile(localFile2);
      ftpHostWithPassword = new FtpHost("ftpHostAlias", "ftpHostNoPassword", "/", "username", "21", [], true, "password");
      sftpHostAgent = new SftpHost("sftpHostAlias", "sftpHostAgent", "/", "username", "22", [], false, true, false, void 0, void 0, void 0);
      sftpHostPkey = new SftpHost("sftpHostAlias", "sftpHostPkey", "/", "username", "22", [], false, false, true, void 0, "passphrase", void 0);
      sftpHostPassword = new SftpHost("sftpHostAlias", "sftpHostPassword", "/", "username", "22", [], true, false, false, "password", void 0, void 0);
      ipd = new InterProcessData([ftpHostNoPassword, ftpHostWithPassword, sftpHostAgent, sftpHostPkey, sftpHostPassword]);
      fs.writeFileSync(this.persistFile, JSON.stringify(ipd.serialize()));
      ipd.reset();
    }

    CreateFixtures.prototype.getSerializePath = function() {
      return this.persistFile;
    };

    return CreateFixtures;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rvb3QvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvc3BlYy9jcmVhdGUtZml4dHVyZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBGQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUZQLENBQUE7O0FBQUEsRUFJQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsaUNBQVIsQ0FKbkIsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsbUJBQVIsQ0FMUCxDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSx1QkFBUixDQU5WLENBQUE7O0FBQUEsRUFPQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHdCQUFSLENBUFgsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FSYixDQUFBOztBQUFBLEVBU0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx5QkFBUixDQVRaLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsVUFBQSw2S0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsUUFBTCxDQUFjO0FBQUEsUUFBQyxNQUFBLEVBQVEsT0FBVDtPQUFkLENBQWdDLENBQUMsSUFBaEQsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixJQUFJLENBQUMsUUFBTCxDQUFjO0FBQUEsUUFBQyxNQUFBLEVBQVEsUUFBVDtPQUFkLENBQWlDLENBQUMsSUFEbkQsQ0FBQTtBQUFBLE1BRUEsZUFBQSxHQUFrQixJQUFJLENBQUMsUUFBTCxDQUFjO0FB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

//# sourceURL=/Users/doot/.atom/packages/remote-edit/spec/create-fixtures.coffee
