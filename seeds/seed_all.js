// seeds/seed_all.js
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {
    appendDataFile,
    writeDataFile,
    writeReservedFile
} from '../fileUtils.js';
import dotenv from 'dotenv';

dotenv.config();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const PUBLIC_DIR = path.join(UPLOADS_DIR, 'public');

// Function to delete all files in /uploads except those in /uploads/public
const deleteUploadsExceptPublic = () => {
    fs.readdirSync(UPLOADS_DIR).forEach(file => {
        const filePath = path.join(UPLOADS_DIR, file);
        if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR)) {
            if (fs.statSync(filePath).isDirectory()) {
                fs.rmdirSync(filePath, {
                    recursive: true
                });
            } else {
                fs.unlinkSync(filePath);
            }
        }
    });
};

// Function to clear reserved.json file
const clearReservedFile = async () => {
    await writeReservedFile([]);
};

export const seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('exchange_items').del();
    await knex('users').del();

    // Deletes all files in /uploads except those in /uploads/public
    deleteUploadsExceptPublic();

    // Clears the reserved.json file
    await clearReservedFile();

    // Inserts users
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    await knex('users').insert([{
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        },
        {
            first_name: 'Alice',
            last_name: 'Johnson',
            email: 'alice.johnson@example.com',
            password: await bcrypt.hash('password123', 10),
            created_at: now,
            updated_at: now
        }
    ]);

    // Fetch the user IDs after insertion
    const users = await knex('users').select('id');

    // Ensures there are users available
    if (users.length === 0) {
        console.error('No users found in the users table.');
        return;
    }

    // Inserts exchange items using the fetched user IDs
    const exchangeItems = [{
            provider: 'Personal Instructor',
            service: 'Service',
            date: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Dumbbells - Jul 11, 2024',
            imgSrc: '/uploads/public/gym.png',
            description: 'Join my personal training sessions and achieve your fitness goals with customized workout plans tailored to your needs and abilities. Whether you are a beginner or an athlete, I am here to help. You will receive one-on-one coaching and support to ensure you reach your desired fitness level. Each session is designed to challenge you and help you grow stronger. Let’s work together to achieve your fitness dreams. I will provide expert guidance and motivation to keep you on track. From strength training to cardio, every aspect of your fitness journey will be covered. The goal is to help you build a healthier, stronger body and to develop a sustainable fitness routine that you can follow for life.',
            user_id: users[0].id,
            created_at: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Yoga Mat',
            service: 'Item',
            date: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Yoga Instructions - Jul 12, 2024',
            imgSrc: '/uploads/public/yoga.png',
            description: 'High-quality yoga mat for your yoga sessions. This mat is designed to provide comfort and stability during your yoga practice. Perfect for beginners and experienced yogis alike, it offers superior grip and cushioning. Its durable material ensures long-lasting use. Enhance your yoga experience with this reliable and comfortable mat. The non-slip surface provides excellent traction, ensuring your safety during even the most challenging poses. It is lightweight and easy to carry, making it ideal for home practice or taking to your favorite yoga class. The mat is also easy to clean, ensuring hygiene and longevity. Elevate your practice with this essential piece of yoga equipment.',
            user_id: users[0].id,
            created_at: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Nutritionist',
            service: 'Service',
            date: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Unused Food Containers - Jul 13, 2024',
            imgSrc: '/uploads/public/nutritionist.png',
            description: 'Receive personalized diet plans that are tailored to your unique needs and preferences. Our nutritionist will help you achieve your health goals with expert advice and support. You will learn about healthy eating habits and how to make better food choices. Regular consultations will ensure you stay on track. Achieve a healthier lifestyle with our professional guidance. We focus on sustainable changes that can be maintained long-term, rather than quick fixes. Whether your goal is weight loss, muscle gain, or improving overall health, we provide comprehensive support. Our nutritionist will work closely with you to understand your dietary needs and preferences, creating a plan that fits your lifestyle. You will also receive tips and strategies to overcome common dietary challenges and maintain your progress.',
            user_id: users[0].id,
            created_at: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:39:04.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Gardening',
            service: 'Service',
            date: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Power Drill - Jul 11, 2024',
            imgSrc: '/uploads/public/gardening.png',
            description: 'Professional gardening services to help you maintain a beautiful and healthy garden. From planting to pruning, we take care of all your gardening needs with expert care. Our team uses the best techniques and tools to ensure your garden thrives. Regular maintenance will keep your garden in perfect condition. Trust us to create and maintain a vibrant garden space for you. We offer a range of services including lawn care, weed control, fertilization, and pest management. Our goal is to enhance the beauty and health of your garden, providing a serene and enjoyable outdoor space. Our experienced gardeners have a keen eye for detail and a deep understanding of plant care. We work with you to understand your vision and bring it to life, ensuring your garden remains a source of pride and joy.',
            user_id: users[1].id,
            created_at: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Lawn Mowing',
            service: 'Service',
            date: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $500 - Jul 12, 2024',
            imgSrc: '/uploads/public/LawnMowing.png',
            description: 'Expert lawn mowing services to keep your lawn looking neat and well-maintained. We use the latest equipment and techniques to ensure a perfect cut every time. Our services are efficient and reliable, making sure your lawn is in top condition. Regular mowing will enhance the appearance and health of your lawn. Let us help you achieve a beautiful and lush lawn. We understand the importance of a well-maintained lawn in enhancing the curb appeal of your home. Our team is committed to providing meticulous care, ensuring that your lawn remains green, healthy, and attractive. We also offer additional services such as edging, trimming, and debris removal to give your lawn a polished look. Trust our experienced professionals to keep your lawn in pristine condition throughout the year.',
            user_id: users[1].id,
            created_at: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Plant Care',
            service: 'Service',
            date: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Watering Can - Jul 13, 2024',
            imgSrc: '/uploads/public/PlantCare.png',
            description: 'Professional plant care services to keep your plants healthy and thriving. From watering to fertilizing, we provide comprehensive care for all types of plants. Our expertise ensures that your plants receive the best possible care. Regular maintenance will keep your plants vibrant and flourishing. Trust us to nurture and protect your green friends. We offer specialized care for indoor and outdoor plants, including repotting, pruning, and pest control. Our plant care experts are knowledgeable about the specific needs of various plant species and tailor their care accordingly. We also provide advice on optimal plant placement, lighting, and watering schedules. Let us help you create a thriving plant environment that brings beauty and tranquility to your space. Whether you have a small collection of houseplants or a large garden, we are here to ensure your plants grow healthy and strong.',
            user_id: users[1].id,
            created_at: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:39:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Buzz Lightyear',
            service: 'Item',
            date: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $15 - Jul 11, 2024',
            imgSrc: '/uploads/public/BuzzLightyear.png',
            description: 'Pre-loved Buzz Lightyear toy in excellent condition. A great addition to any Toy Story fan’s collection. Features all the iconic catchphrases and lights up for interactive play. This toy is perfect for imaginative play and will provide hours of fun. Don’t miss the chance to add this beloved character to your collection. Buzz Lightyear is not just a toy; he is a symbol of adventure and friendship. His durable build ensures that he will be a lasting part of your collection. This action figure is fully posable, allowing for a range of dynamic poses. The intricate details and vibrant colors make it a standout piece. Give the gift of joy and nostalgia with this classic Buzz Lightyear toy.',
            user_id: users[2].id,
            created_at: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-10T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Toy Story',
            service: 'Service',
            date: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $10/hr - Jul 12, 2024',
            imgSrc: '/uploads/public/ToyStory.png',
            description: 'Engaging bedtime Toy Story sessions for your kids. Let their imagination soar with stories of Woody, Buzz, and the gang. Perfect for bedtime or quiet time entertainment, these sessions will captivate and delight your children. Each story is told with enthusiasm and creativity. Make bedtime a magical experience with our Toy Story sessions. Our sessions not only entertain but also encourage imaginative thinking and creativity in children. We bring the beloved characters to life, creating a magical atmosphere that kids will look forward to every night. These interactive sessions allow children to become part of the story, fostering a love for storytelling and reading. Whether it’s a special occasion or a regular nightly routine, our Toy Story sessions are a perfect way to end the day.',
            user_id: users[2].id,
            created_at: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-11T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Comic Book',
            service: 'Item',
            date: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $5 - Jul 13, 2024',
            imgSrc: '/uploads/public/ComicBook.png',
            description: 'Rare and collectible comic book in pristine condition. A must-have for any comic book enthusiast or collector. Dive into a world of adventure and excitement with this unique find. Each page is filled with captivating stories and vibrant artwork. Add this rare gem to your collection and enjoy the thrill of a classic comic book. The detailed illustrations and gripping storylines make this comic a timeless piece. Perfect for both reading and display, this comic book is sure to be a conversation starter. It is a wonderful addition to any collection, bringing a piece of comic book history into your home. This rare find is an opportunity to own a part of the golden age of comics. Whether you are a seasoned collector or new to the world of comics, this book is a valuable addition to your library.',
            user_id: users[2].id,
            created_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-12T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Bicycle Repair',
            service: 'Service',
            date: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $20 - Jul 14, 2024',
            imgSrc: '/uploads/public/BicycleRepair.png',
            description: 'Professional bicycle repair services to ensure your bike is in top condition. From flat tires to brake adjustments, I offer comprehensive repairs and maintenance. My expertise guarantees that your bike will be safe and reliable. Regular servicing will extend the life of your bicycle. Keep your bike in peak performance with my professional repair services. I use high-quality tools and parts to provide the best possible service. Whether you need a quick fix or a complete overhaul, I am here to help. My goal is to ensure your bike runs smoothly and efficiently, providing a safe and enjoyable riding experience. I also offer advice on bike maintenance and care to help you keep your bike in excellent condition. Trust my professional services to keep you riding safely and confidently on the road.',
            user_id: users[0].id,
            created_at: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:05.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Painting Lessons',
            service: 'Service',
            date: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: Art Supplies - Jul 14, 2024',
            imgSrc: '/uploads/public/PaintingLessons.png',
            description: 'Learn the art of painting with professional lessons. Whether you are a beginner or looking to refine your skills, I provide personalized instruction to help you create beautiful artworks. Each lesson is tailored to your skill level and artistic goals. You will learn various techniques and styles to enhance your painting abilities. Unleash your creativity and express yourself through painting. My lessons cover a wide range of topics including color theory, composition, and different painting mediums. I provide a supportive and inspiring environment to help you grow as an artist. You will receive constructive feedback and guidance to improve your skills. Join me in discovering the joy and satisfaction of creating your own masterpieces. Whether you aspire to paint professionally or simply enjoy a new hobby, my lessons will help you achieve your artistic dreams.',
            user_id: users[1].id,
            created_at: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:06.587Z').format('YYYY-MM-DD HH:mm:ss')
        },
        {
            provider: 'Pet Sitting',
            service: 'Service',
            date: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss'),
            exchange: 'Exchange Type: $15/day - Jul 14, 2024',
            imgSrc: '/uploads/public/PetSitting.png',
            description: 'Reliable and caring pet sitting services for your furry friends. I provide daily walks, feeding, and companionship to ensure your pets are happy and well-taken care of while you are away. My services offer peace of mind, knowing that your pets are in good hands. Regular updates will keep you informed about their well-being. Trust me to provide the best care for your beloved pets. I have experience with a variety of animals and understand their unique needs. Whether you have dogs, cats, or other pets, I will ensure they receive the attention and care they deserve. My services include playtime, grooming, and any special care your pets may require. Your pets’ safety and happiness are my top priorities. Let me take the stress out of pet care while you are away, providing a loving and attentive environment for your furry family members.',
            user_id: users[2].id,
            created_at: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment('2024-07-13T02:40:07.587Z').format('YYYY-MM-DD HH:mm:ss')
        }
    ];

    await knex('exchange_items').insert(exchangeItems);

    // Fetch the inserted items
    const insertedItems = await knex('exchange_items').select('*');

    // Converts exchangeItems to the desired format for the JSON file
    const exchangeItemsForJson = insertedItems.map(item => ({
        id: item.id, // Include ID
        provider: item.provider,
        service: item.service,
        imgSrc: `http://localhost:${process.env.PORT || 8080}${item.imgSrc}`,
        exchange: item.exchange,
        description: item.description,
        user_id: item.user_id,
        reserved: item.reserved,
        reserved_by: item.reserved_by,
        reserved_at: item.reserved_at,
        created_at: item.created_at,
        updated_at: item.updated_at
    }));

    // Writes the initial data to data.json
    await writeDataFile(exchangeItemsForJson);

    console.log('Seed data inserted and written to data.json successfully.');
};
