exports.getPopularInstitutions = async (req, res) => {
  try {
    const popularInstitutions = await Institution.findAll({
      where: {
        isActive: true
      },
      include: [
        {
          model: Review,
          attributes: ['rating']
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE reviews.institutionId = Institution.id)'),
            'averageRating'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE reviews.institutionId = Institution.id)'),
            'reviewCount'
          ]
        ]
      },
      order: [
        [sequelize.literal('averageRating'), 'DESC'],
        [sequelize.literal('reviewCount'), 'DESC']
      ],
      limit: 6
    });

    const formattedInstitutions = popularInstitutions.map(institution => ({
      id: institution.id,
      name: institution.institutionName,
      city: institution.city,
      rating: parseFloat(institution.getDataValue('averageRating')) || 0,
      categories: [institution.institutionType],
      image: institution.logo || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
      reviewCount: institution.getDataValue('reviewCount')
    }));

    res.json(formattedInstitutions);
  } catch (error) {
    console.error('Popüler salonlar getirilirken hata:', error);
    res.status(500).json({ message: 'Popüler salonlar getirilirken bir hata oluştu' });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await Institution.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('city')), 'city']
      ],
      where: {
        isActive: true,
        city: {
          [sequelize.Op.not]: null
        }
      },
      order: [['city', 'ASC']]
    });

    const cityList = cities.map(city => city.getDataValue('city'));
    res.json(cityList);
  } catch (error) {
    console.error('Şehirler getirilirken hata:', error);
    res.status(500).json({ message: 'Şehirler getirilirken bir hata oluştu' });
  }
}; 