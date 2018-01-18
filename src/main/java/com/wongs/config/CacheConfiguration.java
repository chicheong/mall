package com.wongs.config;

import io.github.jhipster.config.JHipsterProperties;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.Duration;
import org.ehcache.expiry.Expirations;
import org.ehcache.jsr107.Eh107Configuration;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
@AutoConfigureAfter(value = { MetricsConfiguration.class })
@AutoConfigureBefore(value = { WebConfigurer.class, DatabaseConfiguration.class })
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(Expirations.timeToLiveExpiration(Duration.of(ehcache.getTimeToLiveSeconds(), TimeUnit.SECONDS)))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache("users", jcacheConfiguration);
            cm.createCache(com.wongs.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.wongs.domain.UserInfo.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.UserInfo.class.getName() + ".accounts", jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyAccount.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyAccount.class.getName() + ".delegations", jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyAccount.class.getName() + ".shops", jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyAccount.class.getName() + ".userInfos", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Company.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Company.class.getName() + ".departments", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Company.class.getName() + ".offices", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Company.class.getName() + ".accounts", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Department.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Department.class.getName() + ".offices", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Department.class.getName() + ".accounts", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Department.class.getName() + ".companies", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Office.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Office.class.getName() + ".accounts", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Office.class.getName() + ".companies", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Office.class.getName() + ".departments", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Address.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Country.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.State.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Shop.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Shop.class.getName() + ".accounts", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Delegation.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Category.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Category.class.getName() + ".products", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Product.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Product.class.getName() + ".items", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Product.class.getName() + ".histories", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Product.class.getName() + ".categories", jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductItem.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductItem.class.getName() + ".histories", jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductItem.class.getName() + ".prices", jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductItem.class.getName() + ".quantities", jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductHistory.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductItemHistory.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Price.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.CurrencyRate.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.OrderItem.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.OrderStatusHistory.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyOrder.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyOrder.class.getName() + ".items", jcacheConfiguration);
            cm.createCache(com.wongs.domain.MyOrder.class.getName() + ".statusHistories", jcacheConfiguration);
            cm.createCache(com.wongs.domain.Product.class.getName() + ".styles", jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductStyle.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.ProductStyleHistory.class.getName(), jcacheConfiguration);
            cm.createCache(com.wongs.domain.Quantity.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
