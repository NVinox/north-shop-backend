import {
  Inject,
  forwardRef,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartEntityItem } from './entities/cart-item.entity';
import { ProductService } from 'src/product/product.service';

import { CreateCartItemDTO } from './dto/create-cart-item.dto';
import { CartService } from 'src/cart/cart.service';
import { PaginationResponseDTO } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartEntityItem)
    private readonly cartItemRepository: Repository<CartEntityItem>,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreateCartItemDTO): Promise<CartEntityItem> {
    const { productId, cartId } = dto;
    const product = await this.productService.existProduct(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const cart = await this.cartService.existCart(cartId);

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const createdCartItem = this.cartItemRepository.create(dto);
    const cartItem = await this.cartItemRepository.save(createdCartItem);

    const cartItemWithProduct = await this.cartItemRepository.findOne({
      where: {
        id: cartItem.id,
      },
      relations: ['product'],
    });

    if (!cartItemWithProduct) {
      throw new NotFoundException('Cart item not found after saving');
    }

    return cartItemWithProduct;
  }

  async getAllCartItemsById(
    query: PaginationQueryDTO,
    cartId: number,
  ): Promise<PaginationResponseDTO<CartEntityItem>> {
    const queryBuilder =
      this.cartItemRepository.createQueryBuilder('cart_items');
    queryBuilder.leftJoinAndSelect('cart_items.cart', 'cart');
    queryBuilder.leftJoinAndSelect('cart_items.product', 'product');
    queryBuilder.leftJoinAndSelect(
      'product.images',
      'images',
      'images.isMain = :isMain',
      { isMain: true },
    );
    queryBuilder.where('cart_items.cart_id = :cartId', { cartId });

    const { page, limit, sortOrder } = query;

    queryBuilder
      .orderBy('cart_items.createdAt', sortOrder)
      .offset((page - 1) * limit)
      .limit(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async delete(id: number): Promise<Boolean> {
    const cartItem = await this.cartItemRepository.findOneBy({ id });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    await this.cartItemRepository.remove(cartItem);

    return true;
  }
}
