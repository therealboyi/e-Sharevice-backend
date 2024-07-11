// controllers/exchangeController.js
import knex from 'knex';
import dbConfig from '../knexfile.js';

const db = knex(dbConfig);

export const getAllExchangeItems = async (req, res) => {
  try {
    const items = await db('exchange_items').select('*');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exchange items' });
  }
};

export const createExchangeItem = async (req, res) => {
  const { provider, service, date, exchange, imgSrc, description } = req.body;

  if (!provider || !service || !date || !exchange || !imgSrc || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newItem = await db('exchange_items').insert({
      provider,
      service,
      date,
      exchange,
      imgSrc,
      description
    }).returning('*');
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error creating exchange item' });
  }
};

export const updateExchangeItem = async (req, res) => {
  const { id } = req.params;
  const { provider, service, date, exchange, imgSrc, description } = req.body;

  if (!provider || !service || !date || !exchange || !imgSrc || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedItem = await db('exchange_items')
      .where({ id })
      .update({
        provider,
        service,
        date,
        exchange,
        imgSrc,
        description
      })
      .returning('*');
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error updating exchange item' });
  }
};

export const deleteExchangeItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db('exchange_items')
      .where({ id })
      .del();
    res.status(200).json({ message: 'Exchange item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting exchange item' });
  }
};
