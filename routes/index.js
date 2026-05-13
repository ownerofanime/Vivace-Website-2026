'use strict';

const express = require('express');
const router  = express.Router();

const schools    = require('../models/schools');
const catalogue  = require('../models/cca-catalogue');
const partners   = require('../models/partners');
const faq        = require('../models/faq');
const events     = require('../models/events');

// Home page — intro, hero, market-map, about only
router.get('/', (req, res) => {
  res.render('index', { schools });
});

// Explore page — standalone, optional pre-filter by school
router.get('/explore', (req, res) => {
  res.render('explore-page', { schools, ccas: catalogue, activeSchool: null });
});

router.get('/explore/:school', (req, res) => {
  const school = req.params.school.toLowerCase();
  const valid  = schools.map(s => s.id);
  const activeSchool = valid.includes(school) ? school : null;
  res.render('explore-page', { schools, ccas: catalogue, activeSchool });
});

// About page
router.get('/about', (req, res) => {
  res.render('about-page', { page: 'about' });
});

// FAQ page
router.get('/faq', (req, res) => {
  res.render('faq-page', { faq });
});

// Partners & Deals page
router.get('/partners', (req, res) => {
  res.render('partners-page', { partners, page: 'partners' });
});

// Events / Calendar page
router.get('/events', (req, res) => {
  res.render('events-page', { events });
});

// Venue map page
router.get('/map', (req, res) => {
  res.render('map-page');
});

// Programmes / schedule page
router.get('/programmes', (req, res) => {
  res.render('programmes-page');
});

// CCA detail page
router.get('/cca/:id', (req, res) => {
  const cca = catalogue.find(c => c.id === req.params.id);
  if (!cca) return res.status(404).send('CCA not found');
  res.render('cca', { cca });
});

module.exports = router;
