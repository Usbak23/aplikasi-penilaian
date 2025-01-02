const User = require('../users/model')
const Materi = require('../materi/model')
const Peserta = require('../peserta/model')
const Absensi = require('../absensi/model')

module.exports = {
  index: async (req, res) => {
    try {

      const user = await User.countDocuments()
      const peserta = await Peserta.countDocuments()
      const materi = await Materi.countDocuments()
      const absensi = await Absensi.countDocuments()
      res.render('admin/dashboard/view_dashboard', {
        name: req.session.user.name,
        // role: req.session.user.role,
        title: 'Halaman Dashboard',
        count: {
          user,
          peserta,
          materi,
          absensi
        }
      })
    } catch (err) {
      console.log(err)

    }
  }
}