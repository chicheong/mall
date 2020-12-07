package com.wongs.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.wongs.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.wongs.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.wongs.domain.User.class.getName());
            createCache(cm, com.wongs.domain.Authority.class.getName());
            createCache(cm, com.wongs.domain.User.class.getName() + ".authorities");
            createCache(cm, com.wongs.domain.UserInfo.class.getName());
            createCache(cm, com.wongs.domain.UserInfo.class.getName() + ".accounts");
            createCache(cm, com.wongs.domain.MyAccount.class.getName());
            createCache(cm, com.wongs.domain.MyAccount.class.getName() + ".delegations");
            createCache(cm, com.wongs.domain.MyAccount.class.getName() + ".shops");
            createCache(cm, com.wongs.domain.MyAccount.class.getName() + ".userInfos");
            createCache(cm, com.wongs.domain.Company.class.getName());
            createCache(cm, com.wongs.domain.Company.class.getName() + ".departments");
            createCache(cm, com.wongs.domain.Company.class.getName() + ".offices");
            createCache(cm, com.wongs.domain.Department.class.getName());
            createCache(cm, com.wongs.domain.Department.class.getName() + ".offices");
            createCache(cm, com.wongs.domain.Department.class.getName() + ".companies");
            createCache(cm, com.wongs.domain.Office.class.getName());
            createCache(cm, com.wongs.domain.Office.class.getName() + ".companies");
            createCache(cm, com.wongs.domain.Office.class.getName() + ".departments");
            createCache(cm, com.wongs.domain.Contact.class.getName());
            createCache(cm, com.wongs.domain.Address.class.getName());
            createCache(cm, com.wongs.domain.Country.class.getName());
            createCache(cm, com.wongs.domain.MyState.class.getName());
            createCache(cm, com.wongs.domain.Shop.class.getName());
            createCache(cm, com.wongs.domain.Shop.class.getName() + ".shippingPriceRules");
            createCache(cm, com.wongs.domain.Shop.class.getName() + ".accounts");
            createCache(cm, com.wongs.domain.ShippingPriceRule.class.getName());
            createCache(cm, com.wongs.domain.Delegation.class.getName());
            createCache(cm, com.wongs.domain.Category.class.getName());
            createCache(cm, com.wongs.domain.Category.class.getName() + ".products");
            createCache(cm, com.wongs.domain.Product.class.getName());
            createCache(cm, com.wongs.domain.Product.class.getName() + ".styles");
            createCache(cm, com.wongs.domain.Product.class.getName() + ".items");
            createCache(cm, com.wongs.domain.Product.class.getName() + ".categories");
            createCache(cm, com.wongs.domain.ProductStyle.class.getName());
            createCache(cm, com.wongs.domain.ProductItem.class.getName());
            createCache(cm, com.wongs.domain.ProductItem.class.getName() + ".prices");
            createCache(cm, com.wongs.domain.ProductItem.class.getName() + ".quantities");
            createCache(cm, com.wongs.domain.ProductHistory.class.getName());
            createCache(cm, com.wongs.domain.ProductStyleHistory.class.getName());
            createCache(cm, com.wongs.domain.ProductItemHistory.class.getName());
            createCache(cm, com.wongs.domain.Price.class.getName());
            createCache(cm, com.wongs.domain.Quantity.class.getName());
            createCache(cm, com.wongs.domain.CurrencyRate.class.getName());
            createCache(cm, com.wongs.domain.MyOrder.class.getName());
            createCache(cm, com.wongs.domain.MyOrder.class.getName() + ".shops");
            createCache(cm, com.wongs.domain.MyOrder.class.getName() + ".statusHistories");
            createCache(cm, com.wongs.domain.OrderShop.class.getName());
            createCache(cm, com.wongs.domain.OrderShop.class.getName() + ".items");
            createCache(cm, com.wongs.domain.OrderItem.class.getName());
            createCache(cm, com.wongs.domain.OrderStatusHistory.class.getName());
            createCache(cm, com.wongs.domain.Url.class.getName());
            createCache(cm, com.wongs.domain.Card.class.getName());
            createCache(cm, com.wongs.domain.Shipping.class.getName());
            createCache(cm, com.wongs.domain.Shipping.class.getName() + ".statusHistories");
            createCache(cm, com.wongs.domain.ShippingType.class.getName());
            createCache(cm, com.wongs.domain.ShippingStatusHistory.class.getName());
            createCache(cm, com.wongs.domain.Payment.class.getName());
            createCache(cm, com.wongs.domain.Payment.class.getName() + ".statusHistories");
            createCache(cm, com.wongs.domain.PaymentCard.class.getName());
            createCache(cm, com.wongs.domain.PaymentStatusHistory.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

}
