import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
    description: 'Tugas 2 - REST API CRUD & Database Integration (Express + Drizzle ORM + SQL Server)',
  },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    UserInput: {
      $name: 'Andi Customer',
      $email: 'andi@kantin.test',
      $password: 'rahasia123',
      $role: 'customer',
    },
    StallInput: {
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },
    MenuItemInput: {
      $stallId: 1,
      $name: 'Menu Baru',
      $price: 15000,
      isAvailable: true,
    },
    ReviewInput: {
      $stallId: 1,
      $userId: 5,
      $rating: 5,
      comment: 'Enak banget',
    },
    LikeInput: {
      $reviewId: 1,
      $userId: 5,
    },
    FlagStatusInput: {
      $status: 'resolved',
    },
    AuditLogInput: {
      $userId: 1,
      $action: 'CREATE',
      $targetTable: 'STALLS',
      $targetId: 1,
      metadata: '{"note":"contoh"}',
    },
  },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
